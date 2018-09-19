import { middlewareHandler, middlewareManager } from './middleware';

import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';

import { actionType } from './types';

/**
 * middlewareHandler()
 */
describe('Check the function middlewareHandler()', () => {
  test('return a observable', () => {
    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn();
    const actionValidator = jest.fn();
    const source$ = of<actionType>();

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(middleware).toHaveBeenCalledTimes(0);
    expect(actionValidator).toHaveBeenCalledTimes(0);

    expect(returnValue).toBeInstanceOf(Observable);
  });

  test('observable without arguments return a empty observable', (done) => {
    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn();
    const actionValidator = jest.fn().mockReturnValue(true);
    const source$ = of<actionType>();

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockError = jest.fn();
    const mockComplete = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(0);
      expect(actionValidator).toHaveBeenCalledTimes(0);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockComplete).toHaveBeenCalledTimes(1);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('observable throw a error', (done) => {
    const message = 'test error';

    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn();
    const actionValidator = jest.fn().mockReturnValue(true);
    const source$ = throwError(message);

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockComplete = jest.fn();
    const mockError = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(0);
      expect(actionValidator).toHaveBeenCalledTimes(0);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(message);
      expect(mockComplete).toHaveBeenCalledTimes(0);

      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('middleware function return a actionType object', (done) => {
    const action: actionType = { type: 'action', payload: 42 };
    const result: actionType = { type: 'action', payload: 23 };

    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn().mockReturnValue(result);
    const actionValidator = jest.fn().mockReturnValue(true);
    const source$ = of(action);

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockError = jest.fn();
    const mockComplete = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(1);
      expect(middleware).toHaveBeenCalledWith(action, dispatch);
      expect(actionValidator).toHaveBeenCalledTimes(1);
      expect(actionValidator).toHaveBeenCalledWith(result);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(result);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockComplete).toHaveBeenCalledTimes(1);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('middleware function return a incorrect actionType object', (done) => {
    const action: actionType = { type: 'action', payload: undefined };
    const result: actionType = { type: 'action', payload: 23 };
    const error = new Error('The middleware "mockConstructor" does not return a valid action');

    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn().mockReturnValue(result);
    const actionValidator = jest.fn().mockReturnValue(false);
    const source$ = of(action);

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockComplete = jest.fn();
    const mockError = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(1);
      expect(middleware).toHaveBeenCalledWith(action, dispatch);
      expect(actionValidator).toHaveBeenCalledTimes(1);
      expect(actionValidator).toHaveBeenCalledWith(result);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(error);
      expect(mockComplete).toHaveBeenCalledTimes(0);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('middleware function return a actionType observable', (done) => {
    const action: actionType = { type: 'action', payload: 42 };
    const result: actionType = { type: 'action', payload: 23 };

    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn().mockReturnValue(of(result));
    const actionValidator = jest.fn().mockReturnValue(true);
    const source$ = of(action);

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockError = jest.fn();
    const mockComplete = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(1);
      expect(middleware).toHaveBeenCalledWith(action, dispatch);
      expect(actionValidator).toHaveBeenCalledTimes(1);
      expect(actionValidator).toHaveBeenCalledWith(result);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(result);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockComplete).toHaveBeenCalledTimes(1);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('middleware function return a incorrect actionType observable', (done) => {
    const action: actionType = { type: 'action', payload: 42 };
    const result: actionType = { type: 'action', payload: 23 };
    const error = new Error('The middleware "mockConstructor" does not return a valid action');

    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn().mockReturnValue(of(result));
    const actionValidator = jest.fn().mockReturnValue(false);
    const source$ = of(action);

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockComplete = jest.fn();
    const mockError = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(1);
      expect(middleware).toHaveBeenCalledWith(action, dispatch);
      expect(actionValidator).toHaveBeenCalledTimes(1);
      expect(actionValidator).toHaveBeenCalledWith(result);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(error);
      expect(mockComplete).toHaveBeenCalledTimes(0);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('middleware function return a error observable', (done) => {
    const action: actionType = { type: 'action', payload: 42 };
    const message = 'test error';

    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn().mockReturnValue(throwError(message));
    const actionValidator = jest.fn().mockReturnValue(true);
    const source$ = of(action);

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockComplete = jest.fn();
    const mockError = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(1);
      expect(middleware).toHaveBeenCalledWith(action, dispatch);
      expect(actionValidator).toHaveBeenCalledTimes(0);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith(message);
      expect(mockComplete).toHaveBeenCalledTimes(0);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('middleware function return a empty observable', (done) => {
    const action: actionType = { type: 'action', payload: 42 };

    // mocks
    const dispatch = jest.fn();
    const middleware = jest.fn().mockReturnValue(of());
    const actionValidator = jest.fn().mockReturnValue(true);
    const source$ = of(action);

    const returnValue = middlewareHandler(dispatch, middleware, <any>actionValidator, source$);

    const mockNext = jest.fn();
    const mockError = jest.fn();
    const mockComplete = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(middleware).toHaveBeenCalledTimes(1);
      expect(middleware).toHaveBeenCalledWith(action, dispatch);
      expect(actionValidator).toHaveBeenCalledTimes(0);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockComplete).toHaveBeenCalledTimes(1);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });
});

/**
 * middlewareManager()
 */
describe('Check the function middlewareManager()', () => {
  test('return a callback function', () => {
    // mocks
    const dispatch = jest.fn();
    const actionValidator = jest.fn();
    const middlewareHandler = jest.fn();

    const middlewares: any[] = [];

    const returnCallback = middlewareManager(
      dispatch,
      middlewares,
      <any>actionValidator,
      middlewareHandler,
    );

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(actionValidator).toHaveBeenCalledTimes(0);
    expect(middlewareHandler).toHaveBeenCalledTimes(0);

    expect(typeof returnCallback).toBe('function');
  });

  test('callback function return a expected object (without middlewars)', (done) => {
    // mocks
    const dispatch = jest.fn();
    const actionValidator = jest.fn();
    const middlewareHandler = jest.fn();

    const action: actionType = { type: 'action', payload: 42 };
    const middlewares: any[] = [];
    const source$ = of(action);

    const returnCallback = middlewareManager(
      dispatch,
      middlewares,
      <any>actionValidator,
      middlewareHandler,
    );

    const returnValue = returnCallback(source$);
    expect(returnValue).toBeInstanceOf(Observable);

    const mockNext = jest.fn();
    const mockError = jest.fn();
    const mockComplete = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(actionValidator).toHaveBeenCalledTimes(0);
      expect(middlewareHandler).toHaveBeenCalledTimes(0);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(action);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockComplete).toHaveBeenCalledTimes(1);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });

  test('callback function return a expected object (two middlewars)', (done) => {
    const action1: actionType = { type: 'action', payload: 42 };
    const action2: actionType = { type: 'action', payload: 23 };
    const action3: actionType = { type: 'action', payload: 13 };
    const ofAction1$ = of(action1);
    const ofAction2$ = of(action2);
    const ofAction3$ = of(action3);
    // mocks
    const dispatch = jest.fn();
    const actionValidator = jest.fn();
    const middlewareHandler = jest.fn();
    const middleware1 = jest.fn();
    const middleware2 = jest.fn();

    middlewareHandler.mockReturnValueOnce(ofAction2$);
    middlewareHandler.mockReturnValueOnce(ofAction3$);

    const middlewares: any[] = [middleware1, middleware2];

    const returnCallback = middlewareManager(
      dispatch,
      middlewares,
      <any>actionValidator,
      middlewareHandler,
    );

    const returnValue = returnCallback(ofAction1$);
    expect(returnValue).toBeInstanceOf(Observable);

    const mockNext = jest.fn();
    const mockError = jest.fn();
    const mockComplete = jest.fn(() => {
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(actionValidator).toHaveBeenCalledTimes(0);
      expect(middlewareHandler).toHaveBeenCalledTimes(2);
      expect(middlewareHandler).toHaveBeenNthCalledWith(
        1,
        dispatch,
        middleware1,
        actionValidator,
        ofAction1$,
      );
      expect(middlewareHandler).toHaveBeenNthCalledWith(
        2,
        dispatch,
        middleware2,
        actionValidator,
        ofAction2$,
      );
      expect(middleware1).toHaveBeenCalledTimes(0);
      expect(middleware2).toHaveBeenCalledTimes(0);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(action3);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockComplete).toHaveBeenCalledTimes(1);
      done();
    });

    returnValue.subscribe({
      next: mockNext,
      error: mockError,
      complete: mockComplete,
    });
  });
});
