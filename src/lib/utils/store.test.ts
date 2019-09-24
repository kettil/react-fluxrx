// tslint:disable:no-console
import { isObservable, of } from 'rxjs';

import { actionError, actionFlat, actions, actionValidate, reduceMiddleware, reducerHandler } from './store';

/**
 *
 */
describe('Check the store functions', () => {
  /**
   *
   */
  test('it should be return a observable when actionFlat() is called with an object', () => {
    expect.assertions(2);

    const result = actionFlat({ type: 'qwerty', payload: { a: 1 } });
    expect(isObservable(result)).toBe(true);

    result.subscribe((action) => {
      expect(action).toEqual({ type: 'qwerty', payload: { a: 1 } });
    });
  });

  /**
   *
   */
  test('it should be return a observable when actionFlat() is called with two objects', () => {
    expect.assertions(3);

    const result = actionFlat([{ type: 'qwerty', payload: { a: 1 } }, { type: 'qwerty', payload: { a: 2 } }]);
    expect(isObservable(result)).toBe(true);

    let a = 1;
    result.subscribe((action) => {
      expect(action).toEqual({ type: 'qwerty', payload: { a } });

      a += 1;
    });
  });

  /**
   *
   */
  test('it should be return a observable when actionFlat() is called with an observable', () => {
    expect.assertions(2);

    const result = actionFlat(of({ type: 'qwerty', payload: { a: 1 } }));
    expect(isObservable(result)).toBe(true);

    result.subscribe((action) => {
      expect(action).toEqual({ type: 'qwerty', payload: { a: 1 } });
    });
  });

  /**
   *
   */
  test('it should be return a observable when actionFlat() is called with a promise', () => {
    expect.assertions(2);

    const result = actionFlat(Promise.resolve({ type: 'qwerty', payload: { a: 1 } }));
    expect(isObservable(result)).toBe(true);

    result.subscribe((action) => {
      expect(action).toEqual({ type: 'qwerty', payload: { a: 1 } });
    });
  });

  /**
   *
   */
  test.each<[any]>([['qwerty'], [Symbol('test')]])(
    'it should no error is thrown when actionValidate() is called with a correct action (%p)',
    (type) => {
      actionValidate({ type, payload: { a: 1 } });
    },
  );

  /**
   *
   */
  test.each<[any]>([['action'], [{ type: 5, payload: 'test' }], [{ type: 'a' }]])(
    'it should be throw an error when actionValidate() is called with a corrupted action (%p)',
    (action) => {
      expect.assertions(2);
      try {
        actionValidate(action);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(`Incorrect action structure (${JSON.stringify(action)})`);
      }
    },
  );

  /**
   *
   */
  test('it should be return the observable when actionError() is called', () => {
    const getStateMock = jest.fn().mockReturnValue({ a: 42 });
    const dispatchMock = jest.fn();
    const subscribeMock = jest.fn();
    const errorHandlersMock1 = jest.fn();
    const errorHandlersMock2 = jest.fn();

    const errMock = jest.fn();
    const actionMock$ = jest.fn();

    const store = {
      getState: getStateMock,
      dispatch: dispatchMock,
      subscribe: subscribeMock,
    };

    const callback = actionError([errorHandlersMock1, errorHandlersMock2], store);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(2);

    const result$ = callback(errMock, actionMock$ as any);

    expect(result$).toBe(actionMock$);

    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledTimes(0);
    expect(subscribeMock).toHaveBeenCalledTimes(0);

    expect(errorHandlersMock1).toHaveBeenCalledTimes(1);
    expect(errorHandlersMock1).toHaveBeenCalledWith(errMock, dispatchMock, { a: 42 });
    expect(errorHandlersMock2).toHaveBeenCalledTimes(1);
    expect(errorHandlersMock2).toHaveBeenCalledWith(errMock, dispatchMock, { a: 42 });
  });

  /**
   *
   */
  test('it should be output the two errors when actionError() is called and the middleware are throwing errors', () => {
    jest.spyOn(console, 'error').mockImplementation();

    const getStateMock = jest.fn().mockReturnValue({ a: 42 });
    const dispatchMock = jest.fn();
    const subscribeMock = jest.fn();
    const errorHandlersMock1 = jest.fn().mockImplementation(() => {
      throw new Error('middleware error 1');
    });
    const errorHandlersMock2 = jest.fn().mockImplementation(() => {
      throw new Error('middleware error 2');
    });

    const errMock = jest.fn();
    const actionMock$ = jest.fn();

    const store = {
      getState: getStateMock,
      dispatch: dispatchMock,
      subscribe: subscribeMock,
    };

    const callback = actionError([errorHandlersMock1, errorHandlersMock2], store);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(2);

    const result$ = callback(errMock, actionMock$ as any);

    expect(result$).toBe(actionMock$);

    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledTimes(0);
    expect(subscribeMock).toHaveBeenCalledTimes(0);

    expect(errorHandlersMock1).toHaveBeenCalledTimes(1);
    expect(errorHandlersMock1).toHaveBeenCalledWith(errMock, dispatchMock, { a: 42 });
    expect(errorHandlersMock2).toHaveBeenCalledTimes(1);
    expect(errorHandlersMock2).toHaveBeenCalledWith(errMock, dispatchMock, { a: 42 });

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenNthCalledWith(1, expect.any(Error));
    expect(console.error).toHaveBeenNthCalledWith(2, expect.any(Error));
  });

  /**
   *
   */
  test('it should be return the new state when reducerHandler() and his callback is called', () => {
    const reducer = jest.fn().mockReturnValue({ todos: [{ message: '......' }] });

    const callback = reducerHandler(reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(2);

    const result = callback({ todos: [] }, { type: 'add', payload: { message: '...' } });

    expect(result).toEqual({ todos: [{ message: '......' }] });

    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith({ todos: [] }, { payload: { message: '...' }, type: 'add' });
  });

  /**
   *
   */
  test('it should be return the payload when reducerHandler() and his callback is called with the special action type', () => {
    const reducer = jest.fn();

    const callback = reducerHandler(reducer);

    expect(typeof callback).toBe('function');
    expect(callback.length).toBe(2);

    const result = callback({ todos: [] }, { type: actions.fullUpdate, payload: { message: '...' } });

    expect(result).toEqual({ message: '...' });

    expect(reducer).toHaveBeenCalledTimes(0);
  });

  /**
   *
   */
  test('it should be return only action middleware when reduceMiddleware() is called with the type "action"', () => {
    const init2 = jest.fn();
    const action1 = jest.fn();
    const action2 = jest.fn();
    const action3 = jest.fn();
    const error1 = jest.fn();
    const error2 = jest.fn();

    const middelware1 = { action: action1, error: error1 };
    const middelware2 = { init: init2, action: action2, error: error2 };
    const middelware3 = { action: action3 };

    const result = reduceMiddleware('action', [middelware1, middelware2, middelware3]);

    expect(result).toEqual([action1, action2, action3]);
  });

  /**
   *
   */
  test('checks the keys of the object with the special action types', () => {
    expect(Object.keys(actions)).toEqual(['fullUpdate']);
  });
});
