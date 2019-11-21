/* tslint:disable:no-null-keyword */
import {
  bindActions,
  defaultMapDispatchToProps,
  defaultMapStateToProps,
  isEqual,
  isStrictEqual,
  mergeProps,
  shallowEqual,
} from './connect';

describe('Check the connect functions', () => {
  test('it should be return an object when defaultMapStateToProps() is called', () => {
    const returnValue = defaultMapStateToProps();

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  test('it should be return an object when defaultMapDispatchToProps() is called', () => {
    const returnValue = defaultMapDispatchToProps();

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  test('it should be return the merged object when mergeProps() is called with empty objects', () => {
    const returnValue = mergeProps({}, {}, {});

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  const testFunction = (a: any) => a;
  const testTrue: Array<[object, object, object]> = [
    [{ text: 'string1' }, { mode: 1 }, { text: 'string1', update: testFunction, mode: 1 }],
    [{ text: 'string1' }, { text: 'string2' }, { text: 'string1', update: testFunction }],
  ];

  test.each(testTrue)(
    'it should be return the merged object when mergeProps() is called [%p, %p]',
    (stateProps, ownProps, expected) => {
      const returnValue = mergeProps(stateProps, { update: testFunction }, ownProps);

      expect(returnValue).toEqual(expected);
    },
  );

  test('it should be return object with dispatch funcs when bindActions() is called', () => {
    const dispatch = jest.fn();

    const actions: any = {
      add: (id: number, message: string) => ({ type: 'add', id, message }),
      del: (id: number) => ({ type: 'del', id }),
    };

    const result = bindActions(actions, dispatch);

    expect(Object.keys(result)).toEqual(['add', 'del']);
    expect(result.add).toEqual(expect.any(Function));
    expect(result.del).toEqual(expect.any(Function));

    result.add(1, 'message');
    result.del(1);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, { id: 1, message: 'message', type: 'add' });
    expect(dispatch).toHaveBeenNthCalledWith(2, { id: 1, type: 'del' });
  });

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

  describe('Check the function shallowEqual()', () => {
    const testShallowObject = { a: 5, m: 'test' };
    const testShallowTrue: Array<[any, any]> = [
      [1, 1],
      [0, 0],
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
