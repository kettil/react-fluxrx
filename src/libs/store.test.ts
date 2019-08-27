import * as store from './store';

import { Observable, of } from 'rxjs';

/**
 * actionFilter()
 */
describe('Check the function actionFilter()', () => {
  const testTrue = [
    { type: 'testType', payload: 45 },
    { type: 'testType', payload: 'lorem ipsum' },
    { type: 'testType', payload: [1, 2, 3, 4] },
    { type: 'testType', payload: { a: 'next', page: 5 } },
    { type: 'testType', payload: null },
  ];

  test.each(testTrue)('actionFilter(%s) is true', (action) => {
    const returnValue = store.actionFilter(action);

    expect(returnValue).toBeTruthy();
  });

  const testFalse = [
    { type: 'testType', payload: undefined },
    { type: 5, payload: 'lorem ipsum' },
    { type: null, payload: 'lorem ipsum' },
    { type: undefined, payload: 'lorem ipsum' },
    { type: 'testType' },
    { payload: true },
    null,
    undefined,
    (a: any) => a,
  ];

  test.each(testFalse)('actionFilter(%s) is NOT true', (action) => {
    const returnValue = store.actionFilter(action);

    expect(returnValue).toBeFalsy();
  });
});

/**
 * actionFlat()
 */
describe('Check the function actionFlat()', () => {
  const testTrue = [
    [{ type: 'testType', payload: 'null' }, { type: 'testType', payload: 'null' }],
    [of({ type: 'testType', payload: 'null' }), { type: 'testType', payload: 'null' }],
  ];

  test.each(testTrue)('actionFlat(%s) return a Observable', (action) => {
    const returnValue = store.actionFlat(action);

    expect(returnValue).toBeInstanceOf(Observable);
  });

  test.each(testTrue)('actionFlat(%s) return a expected actionType in a observable', (action, expected, done) => {
    const returnValue = store.actionFlat(action);

    expect(returnValue).toBeInstanceOf(Observable);

    const mockNext = jest.fn((nextAction) => {
      expect(nextAction).toEqual(expected);
      expect(store.actionFilter(nextAction)).toBeTruthy();
    });
    const mockError = jest.fn();
    const mockComplete = jest.fn().mockImplementation(() => {
      expect(mockNext).toHaveBeenCalledTimes(1);
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
 * actionError()
 */
describe('Check the function actionError()', () => {
  test('return a callback function', () => {
    const errorHandler = jest.fn();
    const dispatch = jest.fn();

    const returnCallback = store.actionError(errorHandler, dispatch);

    expect(typeof returnCallback).toBe('function');
    // count the arguments from the
    // callback function
    expect(returnCallback.length).toBe(2);
    expect(errorHandler).toHaveBeenCalledTimes(0);
    expect(dispatch).toHaveBeenCalledTimes(0);
  });

  test('call the callback function)', () => {
    const dispatch = jest.fn();
    const action = { type: 'add', payload: 'a' };
    const action$ = of(action);
    const error = new Error('test error message');

    const mockErrorHandler = jest.fn();

    const returnCallback = store.actionError(mockErrorHandler, dispatch);
    expect(typeof returnCallback).toBe('function');

    // callback
    const returnValue = returnCallback(error, action$);

    // error handler
    expect(mockErrorHandler).toHaveBeenCalledTimes(1);
    expect(mockErrorHandler).toHaveReturnedWith(undefined);
    expect(mockErrorHandler).toHaveBeenCalledWith(error, dispatch);
    // dispatch
    expect(dispatch).toHaveBeenCalledTimes(0);

    // result from callback
    expect(returnValue).toBe(action$);
  });
});

/**
 * errorStoreDefaultHandler()
 */
describe('Check the function errorStoreDefaultHandler()', () => {
  test('return a callback function', () => {
    // mocks
    const log = jest.fn();

    const returnCallback = store.errorStoreDefaultHandler(log);

    expect(log).toHaveBeenCalledTimes(0);
    expect(typeof returnCallback).toBe('function');
  });

  test('callback function return a expected object', () => {
    const error = 'error message';
    // mocks
    const log = jest.fn();
    const dispatch = jest.fn();

    const returnCallback = store.errorStoreDefaultHandler(log);
    const returnValue = returnCallback(error as any, dispatch);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith('Error: ' + error);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(returnValue).toBeUndefined();
  });
});
