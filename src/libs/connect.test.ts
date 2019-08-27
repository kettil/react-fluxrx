import * as connect from './connect';
import { actionSubjectType } from './types';

/**
 * defaultMapStateToProps()
 */
describe('Check the function defaultMapStateToProps()', () => {
  test('defaultMapStateToProps(<object>) return a object', () => {
    const testObject = { a: 5, m: 'test' };
    const returnValue = connect.defaultMapStateToProps(testObject);

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  test('defaultMapStateToProps(<object>) return a expected object', () => {
    const testObject = { a: 5, m: 'test' };
    const returnValue = connect.defaultMapStateToProps(testObject);

    expect(returnValue).toEqual({ state: testObject });
    expect(returnValue.state).toBe(testObject);
  });
});

/**
 * defaultMapDispatchToProps()
 */
describe('Check the function defaultMapDispatchToProps()', () => {
  test('defaultMapStateToProps(<func>) return a object', () => {
    const testFunction = (action: actionSubjectType) => {};

    const returnValue = connect.defaultMapDispatchToProps(testFunction);

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  test('defaultMapStateToProps(<func>) return a expected object', () => {
    const testFunction = (action: actionSubjectType) => {};

    const returnValue = connect.defaultMapDispatchToProps(testFunction);

    expect(returnValue).toEqual({ dispatch: testFunction });
    expect(returnValue.dispatch).toBe(testFunction);
  });
});

/**
 * defaultMergeProps()
 */
describe('Check the function defaultMergeProps()', () => {
  test('defaultMergeProps(<object>, <object>, <object>) return a object', () => {
    const returnValue = connect.defaultMergeProps({}, {}, {});

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  const testFunction = (a: any) => a;
  const testTrue = [
    [{ text: 'string1' }, { update: testFunction }, { mode: 1 }, { text: 'string1', update: testFunction, mode: 1 }],
    [{ text: 'string1' }, { update: testFunction }, { text: 'string2' }, { text: 'string1', update: testFunction }],
  ];

  test.each(testTrue)(
    'defaultMergeProps(%s, %s, %s) return a expected object',
    (stateProps, dispatchProps, ownProps, expected) => {
      const returnValue = connect.defaultMergeProps(stateProps, dispatchProps, ownProps);

      expect(returnValue).toEqual(expected);
    },
  );
});

/**
 * isStrictEqual()
 */
describe('Check the function isStrictEqual()', () => {
  const testObject = { a: 5, m: 'test' };
  const testTrue = [
    [1, 1],
    [0, 0],
    ['test', 'test'],
    [testObject, testObject],
    [null, null],
    [undefined, undefined],
    [true, true],
    [false, false],
  ];
  const testFalse = [[1, 10], [-1, 0], [NaN, NaN], [{ a: 3 }, { a: 3 }], [true, false]];

  test.each(testTrue)('isStrictEqual(%s, %s) is true', (a: any, b: any) => {
    expect(connect.isStrictEqual(a, b)).toBeTruthy();
  });

  test.each(testFalse)('isStrictEqual(%s, %s) is NOT true', (a: any, b: any) => {
    expect(connect.isStrictEqual(a, b)).toBeFalsy();
  });
});

/**
 * isEqual()
 */
describe('Check the function isEqual()', () => {
  const testObject = { a: 5, m: 'test' };
  const testTrue = [
    [1, 1],
    [0, 0],
    ['test', 'test'],
    [testObject, testObject],
    [null, null],
    [undefined, undefined],
    [NaN, NaN],
    [true, true],
    [false, false],
  ];
  const testFalse = [[1, 10], [-1, 0], [{ a: 3 }, { a: 3 }], [true, false]];

  test.each(testTrue)('isEqual(%s, %s) is true', (a: any, b: any) => {
    expect(connect.isEqual(a, b)).toBeTruthy();
  });

  test.each(testFalse)('isEqual(%s, %s) is NOT true', (a: any, b: any) => {
    expect(connect.isEqual(a, b)).toBeFalsy();
  });
});

/**
 * isObject()
 */
describe('Check the function isObject()', () => {
  const testTrue = [[{ a: 5, m: 'test' }]];
  const testFalse = [[1], [0], ['test'], [null], [undefined], [NaN], [true], [false]];

  test.each(testTrue)('isObject(%s) is true', (a: any) => {
    expect(connect.isObject(a)).toBeTruthy();
  });

  test.each(testFalse)('isObject(%s) is NOT true', (a: any) => {
    expect(connect.isObject(a)).toBeFalsy();
  });
});

/**
 * hasProperty()
 */
describe('Check the function hasProperty()', () => {
  const testTrue = [[{ a: 4 }, 'a']];
  const testFalse = [[{ a: 4 }, 'g']];

  test.each(testTrue)('hasProperty(%s, %s) is true', (a: object, b: string) => {
    expect(connect.hasProperty(a, b)).toBeTruthy();
  });

  test.each(testFalse)('hasProperty(%s, %s) is NOT true', (a: object, b: string) => {
    expect(connect.hasProperty(a, b)).toBeFalsy();
  });
});

/**
 * shallowEqual()
 */
describe('Check the function shallowEqual()', () => {
  const testObject = { a: 5, m: 'test' };
  const testTrue = [
    [1, 1],
    [0, 0],
    ['test', 'test'],
    [testObject, testObject],
    [{ a: 3 }, { a: 3 }],
    [{ c: testObject }, { c: testObject }],
    [null, null],
    [undefined, undefined],
    [NaN, NaN],
    [true, true],
    [false, false],
  ];
  const testFalse = [
    [1, 10],
    [-1, 0],
    [{ c: { a: 1 } }, { c: { a: 1 } }],
    [{ c: { a: 1 } }, { c: { a: 1 }, d: true }],
    [true, false],
  ];

  test.each(testTrue)('shallowEqual(%s, %s) is true', (a: any, b: any) => {
    expect(connect.shallowEqual(a, b)).toBeTruthy();
  });

  test.each(testFalse)('shallowEqual(%s, %s) is NOT true', (a: any, b: any) => {
    expect(connect.shallowEqual(a, b)).toBeFalsy();
  });
});
