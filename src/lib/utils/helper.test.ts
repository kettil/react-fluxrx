/* tslint:disable:no-console no-null-keyword */
import { defaultErrorHandler, hasProperty, isActionPayload, isActionType, isObject, isPromise } from './helper';

/**
 *
 */
describe('Check the helper functions', () => {
  /**
   *
   */
  test.each<[any]>([['a'], [Symbol('b')]])('isActionType(%s) is true', (value) => {
    const result = isActionType(value);

    expect(result).toBe(true);
  });

  /**
   *
   */
  test.each<[any]>([[[]], [{}], [undefined], [null]])('isActionType(%s) is false', (value) => {
    const result = isActionType(value);

    expect(result).toBe(false);
  });

  /**
   *
   */
  test.each<[any]>([['a'], [13], [{ a: 1 }], [[7]]])('isActionPayload(%s) is true', (value) => {
    const result = isActionPayload(value);

    expect(result).toBe(true);
  });

  /**
   *
   */
  test.each<[any]>([[Symbol('b')], [null], [undefined]])('isActionPayload(%s) is false', (value) => {
    const result = isActionPayload(value);

    expect(result).toBe(false);
  });

  const testObjectTrue: Array<[any]> = [[{ a: 5, m: 'test' }]];
  const testObjectFalse: Array<[any]> = [[1], [0], ['test'], [null], [undefined], [NaN], [true], [false]];

  /**
   *
   */
  test.each(testObjectTrue)('isObject(%s) is true', (a) => {
    expect(isObject(a)).toBeTruthy();
  });

  /**
   *
   */
  test.each(testObjectFalse)('isObject(%s) is NOT true', (a) => {
    expect(isObject(a)).toBeFalsy();
  });

  const testPropertyTrue: Array<[any, any]> = [[{ a: 4 }, 'a']];
  const testPropertyFalse: Array<[any, any]> = [[{ a: 4 }, 'g']];

  /**
   *
   */
  test.each(testPropertyTrue)('hasProperty(%s, %s) is true', (a, b) => {
    expect(hasProperty(a, b)).toBeTruthy();
  });

  /**
   *
   */
  test.each(testPropertyFalse)('hasProperty(%s, %s) is NOT true', (a, b) => {
    expect(hasProperty(a, b)).toBeFalsy();
  });

  /**
   *
   */
  test('it should be return a true when isPromise() is called with a promise', () => {
    const result = isPromise(Promise.resolve('a'));

    expect(result).toBe(true);
  });

  /**
   *
   */
  test('it should be return a true when isPromise() is called with an object', () => {
    const result = isPromise({ then: () => 42, catch: () => 13 });

    expect(result).toBe(true);
  });

  /**
   *
   */
  test('it should be return a false when isPromise() is called with a function', () => {
    const result = isPromise(() => 7);

    expect(result).toBe(false);
  });

  /**
   *
   */
  test('it should be return a false when isPromise() is called with a string', () => {
    const result = isPromise('i am a promise');

    expect(result).toBe(false);
  });

  /**
   *
   */
  test('it should be output of the message when defaultErrorHandler() is called', () => {
    jest.spyOn(console, 'error').mockImplementation();

    const error = new Error('error handler');

    defaultErrorHandler(error);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
