import * as store from './store';

import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { of } from 'rxjs/internal/observable/of';

import { dispatchType, actionSubjectType } from './types';

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
    () => {},
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

  test.each(testTrue)(
    'actionFlat(%s) return a expected actionType in a observable',
    (action, expected, done) => {
      const returnValue = store.actionFlat(action);

      expect(returnValue).toBeInstanceOf(Observable);

      const mockNext = jest.fn((action) => {
        expect(action).toEqual(expected);
        expect(store.actionFilter(action)).toBeTruthy();
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
    },
  );
});

/**
 * actionError()
 */
describe('Check the function actionError()', () => {
  test('actionError(<error>, <func>) return a function', () => {
    const errorHandler = (error: Error, dispatch: dispatchType) => {};
    const dispatch = (action: actionSubjectType) => {};

    const returnCallback = store.actionError(errorHandler, dispatch);

    expect(typeof returnCallback).toBe('function');
    // count the arguments from the
    // callback function
    expect(returnCallback.length).toBe(1);
  });

  const testErrorHandlerReturnWrongValue = [
    [null],
    [undefined],
    ['string'],
    [0],
    [true],
    [false],
    [of('string')],
    [from([{ type: 'testType-1', payload: undefined }, { type: null, payload: 'lorem ipsum 2' }])],
    [from(['string', 123])],
  ];

  test.each(testErrorHandlerReturnWrongValue)(
    'actionError(<errorHandler>, <dispatch>) and the errorHandler return wrong <actionType>)',
    (wrongActionType, done) => {
      const dispatch = (action: actionSubjectType) => {};
      const error = new Error('test error message');

      const mockErrorHandler = jest.fn().mockReturnValue(wrongActionType);

      const returnCallback = store.actionError(mockErrorHandler, dispatch);
      expect(typeof returnCallback).toBe('function');

      // callback
      const returnValue = returnCallback(error);

      // error handler
      expect(mockErrorHandler).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler).toHaveBeenCalledWith(error, dispatch);

      // result from callback
      expect(returnValue).toBeInstanceOf(Observable);

      const mockNext = jest.fn();
      const mockError = jest.fn();
      const mockComplete = jest.fn().mockImplementation(() => {
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
    },
  );

  const testErrorHandlerReturnCorrectValue = [
    [{ type: 'testType', payload: 'lorem ipsum' }, { type: 'testType', payload: 'lorem ipsum' }],
    [
      of({ type: 'testType', payload: 'lorem ipsum' }),
      { type: 'testType', payload: 'lorem ipsum' },
    ],
  ];

  test.each(testErrorHandlerReturnCorrectValue)(
    'actionError(<errorHandler>, <dispatch>) and the errorHandler return correct <actionType>)',
    (correctActionType, returnActionType, done) => {
      const dispatch = (action: actionSubjectType) => {};
      const error = new Error('test error message');

      const mockErrorHandler = jest.fn().mockReturnValue(correctActionType);

      const returnCallback = store.actionError(mockErrorHandler, dispatch);
      expect(typeof returnCallback).toBe('function');
      // callback
      const returnValue = returnCallback(error);

      // error handler
      expect(mockErrorHandler).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler).toHaveBeenCalledWith(error, dispatch);

      // result from callback
      expect(returnValue).toBeInstanceOf(Observable);

      const mockNext = jest.fn();
      const mockError = jest.fn();
      const mockComplete = jest.fn().mockImplementation(() => {
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(returnActionType);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockComplete).toHaveBeenCalledTimes(1);
        done();
      });

      returnValue.subscribe({
        next: mockNext,
        error: mockError,
        complete: mockComplete,
      });
    },
  );
});
