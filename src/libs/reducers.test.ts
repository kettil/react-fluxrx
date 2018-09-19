import * as reducers from './reducers';

/**
 * errorNewStateIsUndefined()
 */
describe('Check the function errorNewStateIsUndefined()', () => {
  test('errorNewStateIsUndefined(string, <object>) return a string', () => {
    const key = 'testKey';
    const action = { type: 'testType', payload: null };

    const returnValue = reducers.errorNewStateIsUndefined(key, action);

    expect(typeof returnValue).toBe('string');
  });

  test('errorNewStateIsUndefined(string, <object>) return a expected string', () => {
    const key = 'testKey';
    const action = { type: 'testType', payload: null };
    const expected = 'Action testType from Reducer testKey returns an undefined value.';

    const returnValue = reducers.errorNewStateIsUndefined(key, action);

    expect(returnValue).toBe(expected);
  });
});

/**
 * errorReducerIsNotInitialized()
 */
describe('Check the function errorReducerIsNotInitialized()', () => {
  test('errorReducerIsNotInitialized(string) return a string', () => {
    const key = 'testKey';

    const returnValue = reducers.errorReducerIsNotInitialized(key);

    expect(typeof returnValue).toBe('string');
  });

  test('errorReducerIsNotInitialized(string) return a expected string', () => {
    const key = 'testKey';
    const expected = 'Reducer "testKey" did not return an initialized state.';

    const returnValue = reducers.errorReducerIsNotInitialized(key);

    expect(returnValue).toBe(expected);
  });
});

/**
 * errorReducerIsNotAFunction()
 */
describe('Check the function errorReducerIsNotAFunction()', () => {
  test('errorReducerIsNotAFunction(string) return a string', () => {
    const key = 'testKey';

    const returnValue = reducers.errorReducerIsNotAFunction(key);

    expect(typeof returnValue).toBe('string');
  });

  test('errorReducerIsNotAFunction(string) return a expected string', () => {
    const key = 'testKey';
    const expected = 'No reducer function provided for key "testKey".';

    const returnValue = reducers.errorReducerIsNotAFunction(key);

    expect(returnValue).toBe(expected);
  });
});
