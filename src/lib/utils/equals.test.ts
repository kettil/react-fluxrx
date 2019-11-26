/* tslint:disable:no-null-keyword */
import { isArrayEqual, isEqual, isStrictEqual, shallowEqual } from './equals';

describe('Check the equals functions', () => {
  describe('Check the function isStrictEqual()', () => {
    const testObject = { a: 5, m: 'test' };
    const testStrictTrue: Array<[any, any]> = [
      [1, 1],
      [0, 0],
      ['test', 'test'],
      [testObject, testObject],
      [null, null],
      [undefined, undefined],
      [true, true],
      [false, false],
    ];
    const testStrictFalse: Array<[any, any]> = [
      [1, 10],
      [-1, 0],
      [NaN, NaN],
      [{ a: 3 }, { a: 3 }],
      [true, false],
    ];

    test.each(testStrictTrue)('isStrictEqual(%s, %s) is true', (a, b) => {
      expect(isStrictEqual(a, b)).toBeTruthy();
    });

    test.each(testStrictFalse)('isStrictEqual(%s, %s) is NOT true', (a, b) => {
      expect(isStrictEqual(a, b)).toBeFalsy();
    });
  });

  describe('Check the function isEqual()', () => {
    const testObject = { a: 5, m: 'test' };
    const testEqualTrue: Array<[any, any]> = [
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
    const testEqualFalse: Array<[any, any]> = [
      [1, 10],
      [-1, 0],
      [{ a: 3 }, { a: 3 }],
      [true, false],
    ];

    test.each(testEqualTrue)('isEqual(%s, %s) is true', (a, b) => {
      expect(isEqual(a, b)).toBeTruthy();
    });

    test.each(testEqualFalse)('isEqual(%s, %s) is NOT true', (a, b) => {
      expect(isEqual(a, b)).toBeFalsy();
    });
  });

  describe('Check the function isArrayEqual()', () => {
    const testObject = { a: 5, m: 'test' };
    const testEqualTrue: Array<[any, any]> = [
      [[], []],
      [
        [1, 3],
        [1, 3],
      ],
    ];
    const testEqualFalse: Array<[any, any]> = [
      [1, 10],
      [-1, 0],
      [[1], []],
      [
        [1, 5],
        [5, 1],
      ],
      [{ a: 3 }, { a: 3 }],
      ['test', 'test'],
      [testObject, testObject],
      [null, null],
      [undefined, undefined],
      [NaN, NaN],
      [true, false],
      [true, true],
      [false, false],
    ];

    test.each(testEqualTrue)('isArrayEqual(%s, %s) is true', (a, b) => {
      expect(isArrayEqual(a, b)).toBeTruthy();
    });

    test.each(testEqualFalse)('isArrayEqual(%s, %s) is NOT true', (a, b) => {
      expect(isArrayEqual(a, b)).toBeFalsy();
    });
  });

  describe('Check the function shallowEqual()', () => {
    const testShallowObject = { a: 5, m: 'test' };
    const testShallowTrue: Array<[any, any]> = [
      [1, 1],
      [0, 0],
      [[], []],
      [
        [1, 3],
        [1, 3],
      ],
      ['test', 'test'],
      [testShallowObject, testShallowObject],
      [{ a: 3 }, { a: 3 }],
      [{ c: testShallowObject }, { c: testShallowObject }],
      [null, null],
      [undefined, undefined],
      [NaN, NaN],
      [true, true],
      [false, false],
    ];
    const testShallowFalse: Array<[any, any]> = [
      [1, 10],
      [-1, 0],
      [[1], []],
      [
        [1, 5],
        [5, 1],
      ],
      [{ c: { a: 1 } }, { c: { a: 1 } }],
      [{ c: { a: 1 } }, { c: { a: 1 }, d: true }],
      [true, false],
    ];

    test.each(testShallowTrue)('shallowEqual(%s, %s) is true', (a, b) => {
      expect(shallowEqual(a, b)).toBeTruthy();
    });

    test.each(testShallowFalse)('shallowEqual(%s, %s) is NOT true', (a, b) => {
      expect(shallowEqual(a, b)).toBeFalsy();
    });
  });
});
