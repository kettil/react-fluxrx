import { createStore } from './store';

import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';

/**
 * createStore()
 */
describe('Check the function createStore()', () => {
  test('create the store', () => {
    // mocks
    const reducer = jest.fn();
    const reducerHandler = jest.fn();
    const middlewareManager = jest.fn();
    const middlewareManagerHelper = jest.fn();
    const middlewareHandler = jest.fn();
    const errorStoreHandler = jest.fn();
    const actionFlat = jest.fn();
    const actionFilter = jest.fn();
    const actionError = jest.fn();

    const init = { a: 42 };
    const result = { a: 23 };
    const middlewares = undefined;
    const options: any = {
      actionFlat,
      actionFilter,
      actionError,
      reducerHandler,
      errorStoreHandler,
      middlewareManager,
      middlewareHandler,
    };

    const returnMiddlewareHelper = of('a');
    const returnActionError = of('b');

    reducerHandler.mockReturnValue(reducer);
    reducer.mockReturnValue(result);
    middlewareManager.mockReturnValue(middlewareManagerHelper);
    middlewareManagerHelper.mockReturnValue(returnMiddlewareHelper);
    actionError.mockReturnValue(returnActionError);

    // create callback function
    const returnValue = createStore(reducer, init, middlewares, options);

    expect(typeof returnValue).toBe('object');
    expect(Object.keys(returnValue).length).toBe(3);
    expect(typeof returnValue.dispatch).toBe('function');
    expect(typeof returnValue.getState).toBe('function');
    expect(typeof returnValue.subscribe).toBe('function');
    expect(returnValue.getState()).toEqual(result);

    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducerHandler).toHaveBeenCalledTimes(1);
    expect(middlewareManager).toHaveBeenCalledTimes(1);
    expect(middlewareManagerHelper).toHaveBeenCalledTimes(1);
    expect(middlewareHandler).toHaveBeenCalledTimes(0);
    expect(errorStoreHandler).toHaveBeenCalledTimes(0);
    expect(actionFlat).toHaveBeenCalledTimes(0);
    expect(actionFilter).toHaveBeenCalledTimes(0);
    expect(actionError).toHaveBeenCalledTimes(1);

    expect(reducerHandler).toHaveBeenCalledWith(reducer);
    expect(actionError).toHaveBeenCalledWith(errorStoreHandler, returnValue.dispatch);
    expect(middlewareManager).toHaveBeenCalledWith(returnValue.dispatch, [], actionFilter, middlewareHandler);
  });

  test('subscription without updates', (done) => {
    const init = { a: 'z' };

    // mocks
    const reducer = jest.fn();
    const reducerHandler = jest.fn();
    const middlewareManager = jest.fn(() => (source$: any) => source$);
    const middlewareHandler = jest.fn();
    const errorStoreHandler = jest.fn();
    const actionFlat = jest.fn();
    const actionFilter = jest.fn();
    const actionError = jest.fn();

    const middlewares: any[] = [];
    const options: any = {
      actionFlat,
      actionFilter,
      actionError,
      reducerHandler,
      errorStoreHandler,
      middlewareManager,
      middlewareHandler,
    };

    reducerHandler.mockReturnValue(reducer);

    // create callback function
    const returnValue = createStore(reducer, init, middlewares, options);

    expect(returnValue.getState()).toEqual(init);

    returnValue
      .subscribe((state) => {
        try {
          expect(state).toBe(init);
        } catch (err) {
          done(err);
        }
      })
      .unsubscribe();

    expect(reducer).toHaveBeenCalledTimes(0);
    expect(reducerHandler).toHaveBeenCalledTimes(1);
    expect(middlewareManager).toHaveBeenCalledTimes(1);
    expect(middlewareHandler).toHaveBeenCalledTimes(0);
    expect(errorStoreHandler).toHaveBeenCalledTimes(0);
    expect(actionFlat).toHaveBeenCalledTimes(0);
    expect(actionFilter).toHaveBeenCalledTimes(0);
    expect(actionError).toHaveBeenCalledTimes(1);
    done();
  });

  test('subscription with updates', (done) => {
    const init = { a: 'z' };
    const action1 = { type: 'add', payload: 'a' };
    const action2 = of({ type: 'add', payload: 'b' });
    const action3 = { type: 'add', payload: 'c' };
    const result1 = { a: 'a' };
    const result2 = { a: 'b' };
    const result3 = { a: 'c' };

    // mocks
    const reducer = jest.fn((state, action) => ({ ...state, a: action.payload }));
    const reducerHandler = jest.fn();
    const middlewareManager = jest.fn(() => (source$: any) => source$);
    const middlewareHandler = jest.fn();
    const errorStoreHandler = jest.fn();
    const actionFlat = jest.fn((action) => (action instanceof Observable ? action : of(action)));
    const actionFilter = jest.fn(() => true);
    const actionError = jest.fn();

    const middlewares: any[] = [];
    const options: any = {
      actionFlat,
      actionFilter,
      actionError,
      reducerHandler,
      errorStoreHandler,
      middlewareManager,
      middlewareHandler,
    };

    reducerHandler.mockReturnValue(reducer);

    // create callback function
    const returnValue = createStore(reducer, init, middlewares, options);

    returnValue.dispatch(action1);
    returnValue.dispatch(action2);
    returnValue.dispatch(action3);

    expect(returnValue.getState()).toEqual(result3);

    returnValue
      .subscribe((state) => {
        try {
          expect(state).toEqual(result3);
        } catch (err) {
          done(err);
        }
      })
      .unsubscribe();

    expect(reducer).toHaveBeenCalledTimes(3);
    expect(reducerHandler).toHaveBeenCalledTimes(1);
    expect(middlewareManager).toHaveBeenCalledTimes(1);
    expect(middlewareHandler).toHaveBeenCalledTimes(0);
    expect(errorStoreHandler).toHaveBeenCalledTimes(0);
    expect(actionFlat).toHaveBeenCalledTimes(3);
    expect(actionFilter).toHaveBeenCalledTimes(3);
    expect(actionError).toHaveBeenCalledTimes(1);

    expect(actionFlat).toHaveBeenNthCalledWith(1, action1, 0);
    expect(actionFlat).toHaveBeenNthCalledWith(2, action2, 1);
    expect(actionFlat).toHaveBeenNthCalledWith(3, action3, 2);
    expect(actionFilter).toHaveBeenNthCalledWith(1, action1, 0);
    expect(actionFilter).toHaveBeenNthCalledWith(2, (<any>action2).value, 1);
    expect(actionFilter).toHaveBeenNthCalledWith(3, action3, 2);
    expect(reducer).toHaveBeenNthCalledWith(1, init, action1, 0);
    expect(reducer).toHaveBeenNthCalledWith(2, result1, (<any>action2).value, 1);
    expect(reducer).toHaveBeenNthCalledWith(3, result2, action3, 2);
    done();
  });

  test('update store with wronge action', (done) => {
    const init = { a: 'z' };
    const action = { type: undefined, payload: 'a' };

    // mocks
    const reducer = jest.fn((state, action) => ({ ...state, a: action.payload }));
    const reducerHandler = jest.fn();
    const middlewareManager = jest.fn(() => (source$: any) => source$);
    const middlewareHandler = jest.fn();
    const errorStoreHandler = jest.fn();
    const actionFlat = jest.fn((action) => of(action));
    const actionFilter = jest.fn(() => false);
    const actionError = jest.fn(() => (err: any) => errorStoreHandler(err));

    const middlewares: any[] = [];
    const options: any = {
      actionFlat,
      actionFilter,
      actionError,
      reducerHandler,
      errorStoreHandler,
      middlewareManager,
      middlewareHandler,
    };

    reducerHandler.mockReturnValue(reducer);

    // create callback function
    const returnValue = createStore(reducer, init, middlewares, options);

    returnValue.dispatch(<any>action);

    expect(returnValue.getState()).toEqual(init);

    expect(reducer).toHaveBeenCalledTimes(0);
    expect(reducerHandler).toHaveBeenCalledTimes(1);
    expect(middlewareManager).toHaveBeenCalledTimes(1);
    expect(middlewareHandler).toHaveBeenCalledTimes(0);
    expect(errorStoreHandler).toHaveBeenCalledTimes(0);
    expect(actionFlat).toHaveBeenCalledTimes(1);
    expect(actionFilter).toHaveBeenCalledTimes(1);
    expect(actionError).toHaveBeenCalledTimes(1);

    expect(actionFlat).toHaveBeenCalledWith(action, 0);
    expect(actionFilter).toHaveBeenCalledWith(action, 0);
    done();
  });

  test('update store with execption', (done) => {
    const init = { a: 'z' };
    const action = throwError('error message');

    // mocks
    const reducer = jest.fn();
    const reducerHandler = jest.fn();
    const middlewareManager = jest.fn(() => (source$: any) => source$);
    const middlewareHandler = jest.fn();
    const errorStoreHandler = jest.fn((message) => {
      try {
        expect(message).toBe('error message');
        done();
      } catch (err) {
        done(err);
      }
    });
    const actionFlat = jest.fn((action) => (action instanceof Observable ? action : of(action)));
    const actionFilter = jest.fn(() => true);
    const actionError = jest.fn((handler) => (err: any) => handler(err));

    const middlewares: any[] = [];
    const options: any = {
      actionFlat,
      actionFilter,
      actionError,
      reducerHandler,
      errorStoreHandler,
      middlewareManager,
      middlewareHandler,
    };

    reducerHandler.mockReturnValue(reducer);

    // create callback function
    const returnValue = createStore(reducer, init, middlewares, options);

    expect(typeof returnValue).toBe('object');

    returnValue.dispatch(action);
  });

  test('subscription with updates and exception', (done) => {
    const init = { a: 'z' };
    const action = throwError('error message');

    // mocks
    const reducer = jest.fn();
    const reducerHandler = jest.fn();
    const middlewareManager = jest.fn(() => (source$: any) => source$);
    const middlewareHandler = jest.fn();
    const errorStoreHandler = jest.fn((message) => {
      try {
        expect(message).toBe('error message');
        done();
      } catch (err) {
        done(err);
      }
    });
    const actionFlat = jest.fn((action) => (action instanceof Observable ? action : of(action)));
    const actionFilter = jest.fn(() => true);
    const actionError = jest.fn((handler) => (err: any) => handler(err));

    const middlewares: any[] = [];
    const options: any = {
      actionFlat,
      actionFilter,
      actionError,
      reducerHandler,
      errorStoreHandler,
      middlewareManager,
      middlewareHandler,
    };

    reducerHandler.mockReturnValue(reducer);

    // create callback function
    const returnValue = createStore(reducer, init, middlewares, options);

    expect(typeof returnValue).toBe('object');

    returnValue.dispatch(action);
  });
});
