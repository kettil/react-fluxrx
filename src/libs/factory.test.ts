import * as factory from './factory';
import {
  shallowEqual,
  isStrictEqual,
  defaultMapStateToProps,
  defaultMapDispatchToProps,
  defaultMergeProps,
} from './connect';

/**
 * mapStateToPropsWithCacheFactory()
 */
describe('Check the function mapStateToPropsWithCacheFactory()', () => {
  test('return a callback function', () => {
    // mocks
    const mapStateToProps = jest.fn();
    const areStatesEqual = jest.fn();
    const arePropsEqual = jest.fn();

    // create callback function
    const returnCallback = factory.mapStateToPropsWithCacheFactory(mapStateToProps, areStatesEqual, arePropsEqual);

    expect(mapStateToProps).toHaveBeenCalledTimes(0);
    expect(areStatesEqual).toHaveBeenCalledTimes(0);
    expect(arePropsEqual).toHaveBeenCalledTimes(0);

    expect(typeof returnCallback).toBe('function');
    expect(returnCallback.length).toBe(3);
  });

  test('callback function return a expected object (one call)', () => {
    const state = { i: 5, s: 'lorem', l: [1, 2, 3] };
    const props = { o: { a: true }, i: false };
    const result = { state: { i: 5, s: 'lorem', l: [1, 2, 3] } };

    // mocks
    const mapStateToProps = jest.fn((state) => ({ state }));
    const areStatesEqual = jest.fn();
    const arePropsEqual = jest.fn();

    // create callback function
    const returnCallback = factory.mapStateToPropsWithCacheFactory(mapStateToProps, areStatesEqual, arePropsEqual);

    const returnValue = returnCallback(state, props, true);
    expect(returnValue).toEqual(result);

    expect(areStatesEqual).toHaveBeenCalledTimes(0);
    expect(arePropsEqual).toHaveBeenCalledTimes(0);
    expect(mapStateToProps).toHaveBeenCalledTimes(1);
    expect(mapStateToProps).toHaveBeenCalledWith(state, props);
  });

  const state1 = { i: 5, s: 'lorem', l: [1, 2, 3] };
  const state2 = { i: 8, s: 'ipsum', l: [1, 2, 5] };
  const props1 = { o: { a: true }, f: false };
  const props2 = { o: { a: false }, f: true };
  const result1 = { i: 5, s: 'lorem', l: [1, 2, 3], o: { a: true }, f: false };
  const result2 = { i: 8, s: 'ipsum', l: [1, 2, 5], o: { a: false }, f: true };
  const result2_1 = { f: false, i: 8, l: [1, 2, 5], o: { a: true }, s: 'ipsum' };
  const result2_2 = { f: true, i: 5, l: [1, 2, 3], o: { a: false }, s: 'lorem' };

  const testTwoCalls = [
    [false, state1, state2, props1, props2, props2, result1, result2, 2],
    [false, state1, state2, props1, props1, props1, result1, result2_1, 2],
    [false, state1, state1, props1, props2, props1, result1, result1, 1],
    [false, state1, state1, props1, props1, props1, result1, result1, 1],
    [true, state1, state2, props1, props2, props2, result1, result2, 2],
    [true, state1, state2, props1, props1, props1, result1, result2_1, 2],
    [true, state1, state1, props1, props2, props2, result1, result2_2, 2],
    [true, state1, state1, props1, props1, props1, result1, result1, 1],
  ];

  test.each(testTwoCalls)(
    'callback function return a expected object (two calls)',
    (hasDepends, state1, state2, props1, props2, props2Call, result1, result2, mapCalls) => {
      // mocks
      const mapStateToProps = jest.fn((s, p) => ({ ...s, ...p }));
      const areStatesEqual = jest.fn((a, b) => a === b);
      const arePropsEqual = jest.fn(shallowEqual);

      // create callback function
      const returnCallback = factory.mapStateToPropsWithCacheFactory(mapStateToProps, areStatesEqual, arePropsEqual);

      // first call
      const returnValue1 = returnCallback(state1, props1, hasDepends);
      expect(returnValue1).toEqual(result1);
      expect(mapStateToProps).toHaveBeenCalledWith(state1, props1);

      // second call
      const returnValue2 = returnCallback(state2, props2, hasDepends);
      expect(returnValue2).toEqual(result2);
      expect(areStatesEqual).toHaveBeenCalledWith(state1, state2);
      expect(arePropsEqual).toHaveBeenCalledWith(props1, props2);
      expect(mapStateToProps).toHaveBeenCalledWith(state2, props2Call);

      // expected mocks calls
      expect(areStatesEqual).toHaveBeenCalledTimes(1);
      expect(arePropsEqual).toHaveBeenCalledTimes(1);
      expect(mapStateToProps).toHaveBeenCalledTimes(mapCalls);
    },
  );
});

/**
 * mapStateToPropsWithCacheFactory()
 */
describe('Check the function mapDispatchToPropsWithCacheFactory()', () => {
  test('return a callback function', () => {
    // mocks
    const mapDispatchToProps = jest.fn();
    const arePropsEqual = jest.fn();

    // create callback function
    const returnCallback = factory.mapDispatchToPropsWithCacheFactory(mapDispatchToProps, arePropsEqual);

    expect(mapDispatchToProps).toHaveBeenCalledTimes(0);
    expect(arePropsEqual).toHaveBeenCalledTimes(0);

    expect(typeof returnCallback).toBe('function');
    expect(returnCallback.length).toBe(3);
  });

  test('callback function return a expected object (one call)', () => {
    const dispatch = jest.fn();
    const props = { o: { a: true }, i: false };
    const result = { dispatch, o: { a: true }, i: false };

    // mocks
    const mapDispatchToProps = jest.fn((dispatch, props) => ({ ...props, dispatch }));
    const arePropsEqual = jest.fn();

    // create callback function
    const returnCallback = factory.mapDispatchToPropsWithCacheFactory(mapDispatchToProps, arePropsEqual);

    const returnValue = returnCallback(dispatch, props, true);
    expect(returnValue).toEqual(result);

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(arePropsEqual).toHaveBeenCalledTimes(0);
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, props);
  });

  const props1 = { o: { a: 'true' }, f: 23 };
  const props2 = { o: { a: 42 }, f: 'lorem' };
  const result1 = { o: { a: 'true' }, f: 23 };
  const result2 = { o: { a: 42 }, f: 'lorem' };

  const testTwoCalls = [
    [false, props1, props2, props1, result1, result1, 1],
    [false, props1, props1, props1, result1, result1, 1],
    [true, props1, props2, props2, result1, result2, 2],
    [true, props1, props1, props1, result1, result1, 1],
  ];

  test.each(testTwoCalls)(
    'callback function return a expected object (two calls)',
    (hasDepends, props1, props2, props2Call, result1, result2, mapCalls) => {
      // mocks
      const dispatch = jest.fn();
      const mapDispatchToProps = jest.fn((dispatch, props) => ({ ...props, dispatch }));
      const arePropsEqual = jest.fn(shallowEqual);

      // create callback function
      const returnCallback = factory.mapDispatchToPropsWithCacheFactory(mapDispatchToProps, arePropsEqual);

      // first call
      const returnValue1 = returnCallback(dispatch, props1, hasDepends);
      expect(returnValue1).toEqual({ dispatch, ...result1 });
      expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, props1);

      // second call
      const returnValue2 = returnCallback(dispatch, props2, hasDepends);
      expect(returnValue2).toEqual({ dispatch, ...result2 });
      expect(arePropsEqual).toHaveBeenCalledWith(props1, props2);
      expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, props2Call);

      // expected mocks calls
      expect(arePropsEqual).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenCalledTimes(mapCalls);
    },
  );
});

/**
 * mergePropsWithCacheFactory()
 */
describe('Check the function mergePropsWithCacheFactory()', () => {
  test('return a callback function', () => {
    // mocks
    const mergeProps = jest.fn();
    const arePropsEqual = jest.fn();
    const areMappedEqual = jest.fn();
    const areDispatchedEqual = jest.fn();

    // create callback function
    const returnCallback = factory.mergePropsWithCacheFactory(
      mergeProps,
      arePropsEqual,
      areMappedEqual,
      areDispatchedEqual,
    );

    expect(mergeProps).toHaveBeenCalledTimes(0);
    expect(arePropsEqual).toHaveBeenCalledTimes(0);
    expect(areMappedEqual).toHaveBeenCalledTimes(0);
    expect(areDispatchedEqual).toHaveBeenCalledTimes(0);

    expect(typeof returnCallback).toBe('function');
    expect(returnCallback.length).toBe(3);
  });

  test('callback function return a expected object (one call)', () => {
    const stateMapped = { i: 5, s: 'lorem', l: [1, 2, 3] };
    const dispatchMapped = { dispatch: (a: any) => {}, o: 'ipsum' };
    const props = { o: { a: true }, i: false };
    const result = { state: { i: 5, s: 'lorem', l: [1, 2, 3] } };

    // mocks
    const mergeProps = jest.fn().mockReturnValue(result);
    const arePropsEqual = jest.fn();
    const areMappedEqual = jest.fn();
    const areDispatchedEqual = jest.fn();

    // create callback function
    const returnCallback = factory.mergePropsWithCacheFactory(
      mergeProps,
      arePropsEqual,
      areMappedEqual,
      areDispatchedEqual,
    );

    const returnValue = returnCallback(stateMapped, dispatchMapped, props);
    expect(returnValue).toEqual(result);

    expect(arePropsEqual).toHaveBeenCalledTimes(0);
    expect(areMappedEqual).toHaveBeenCalledTimes(0);
    expect(areDispatchedEqual).toHaveBeenCalledTimes(0);
    expect(mergeProps).toHaveBeenCalledTimes(1);
    expect(mergeProps).toHaveBeenCalledWith(stateMapped, dispatchMapped, props);
  });

  const s1 = { a: 'lorem' };
  const s2 = { a: 'ipsum' };
  const d1 = { b: [1, 2, 3] };
  const d2 = { b: [9, 8, 7] };
  const p1 = { c: 23 };
  const p2 = { c: 42 };
  const r111 = { ...s1, ...d1, ...p1 };
  const r112 = { ...s1, ...d1, ...p2 };
  const r121 = { ...s1, ...d2, ...p1 };
  const r122 = { ...s1, ...d2, ...p2 };
  const r211 = { ...s2, ...d1, ...p1 };
  const r212 = { ...s2, ...d1, ...p2 };
  const r221 = { ...s2, ...d2, ...p1 };
  const r222 = { ...s2, ...d2, ...p2 };

  const testTwoCalls = [
    [s1, s1, d1, d1, p1, p1, r111, r111, 1],
    [s1, s1, d1, d1, p1, p2, r111, r112, 2],
    [s1, s1, d1, d2, p1, p1, r111, r121, 2],
    [s1, s1, d1, d2, p1, p2, r111, r122, 2],
    [s1, s2, d1, d1, p1, p1, r111, r211, 2],
    [s1, s2, d1, d1, p1, p2, r111, r212, 2],
    [s1, s2, d1, d2, p1, p1, r111, r221, 2],
    [s1, s2, d1, d2, p1, p2, r111, r222, 2],
  ];

  test.each(testTwoCalls)(
    'callback function return a expected object (two calls)',
    (s1, s2, d1, d2, p1, p2, r1, r2, c1) => {
      const mergeProps = jest.fn((s, d, p) => ({ ...p, ...s, ...d }));
      const arePropsEqual = jest.fn(shallowEqual);
      const areMappedEqual = jest.fn(shallowEqual);
      const areDispatchedEqual = jest.fn(shallowEqual);

      // create callback function
      const returnCallback = factory.mergePropsWithCacheFactory(
        mergeProps,
        arePropsEqual,
        areMappedEqual,
        areDispatchedEqual,
      );

      // first call
      const returnValue1 = returnCallback(s1, d1, p1);
      expect(returnValue1).toEqual(r1);
      expect(mergeProps).toHaveBeenCalledWith(s1, d1, p1);

      // second call
      const returnValue2 = returnCallback(s2, d2, p2);
      expect(returnValue2).toEqual(r2);

      expect(arePropsEqual).toHaveBeenCalledWith(p1, p2);
      expect(areMappedEqual).toHaveBeenCalledWith(s1, s2);
      expect(areDispatchedEqual).toHaveBeenCalledWith(d1, d2);
      expect(mergeProps).toHaveBeenCalledWith(s2, d2, p2);

      // expected mocks calls
      expect(arePropsEqual).toHaveBeenCalledTimes(1);
      expect(areMappedEqual).toHaveBeenCalledTimes(1);
      expect(areDispatchedEqual).toHaveBeenCalledTimes(1);
      expect(mergeProps).toHaveBeenCalledTimes(c1);
    },
  );
});

/**
 * mapStateToPropsWithCacheFactory()
 */
describe('Check the function propsFactory()', () => {
  test('return a callback function', () => {
    // mocks
    const mapStateToPropsWithCache = jest.fn();
    const mapDispatchToPropsWithCache = jest.fn();
    const mergePropsWithCache = jest.fn();
    const mapStateToProps = jest.fn();
    const mapDispatchToProps = jest.fn();

    // create callback function
    const returnCallback = factory.propsFactory(
      mapStateToPropsWithCache,
      mapDispatchToPropsWithCache,
      mergePropsWithCache,
      mapStateToProps,
      mapDispatchToProps,
    );

    expect(mapStateToPropsWithCache).toHaveBeenCalledTimes(0);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledTimes(0);
    expect(mergePropsWithCache).toHaveBeenCalledTimes(0);
    expect(mapStateToProps).toHaveBeenCalledTimes(0);
    expect(mapDispatchToProps).toHaveBeenCalledTimes(0);

    expect(typeof returnCallback).toBe('function');
    expect(returnCallback.length).toBe(1);
  });
  test('callback function return a callback function', () => {
    // mocks
    const mapStateToPropsWithCache = jest.fn();
    const mapDispatchToPropsWithCache = jest.fn();
    const mergePropsWithCache = jest.fn();
    const mapStateToProps = jest.fn();
    const mapDispatchToProps = jest.fn();
    const dispatch = jest.fn();

    // create callback function
    const returnCallback1 = factory.propsFactory(
      mapStateToPropsWithCache,
      mapDispatchToPropsWithCache,
      mergePropsWithCache,
      mapStateToProps,
      mapDispatchToProps,
    );

    const returnCallback2 = returnCallback1(dispatch);

    expect(mapStateToPropsWithCache).toHaveBeenCalledTimes(0);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledTimes(0);
    expect(mergePropsWithCache).toHaveBeenCalledTimes(0);
    expect(mapStateToProps).toHaveBeenCalledTimes(0);
    expect(mapDispatchToProps).toHaveBeenCalledTimes(0);
    expect(dispatch).toHaveBeenCalledTimes(0);

    expect(typeof returnCallback2).toBe('function');
    expect(returnCallback2.length).toBe(2);
  });

  test('callback² function return a expected object (with one argument by map*ToProps())', () => {
    const state = { a: 'lorem' };
    const props = { b: 42 };
    const mappedState = { c: 'ipsum' };
    const mappedDispatch = { d: 23 };
    const result = { e: [1, 2, 3] };

    // mocks
    const mapStateToPropsWithCache = jest.fn().mockReturnValue(mappedState);
    const mapDispatchToPropsWithCache = jest.fn().mockReturnValue(mappedDispatch);
    const mergePropsWithCache = jest.fn().mockReturnValue(result);
    const mapStateToProps = jest.fn((a) => ({ ...a }));
    const mapDispatchToProps = jest.fn((a) => ({ ...a }));
    const dispatch = jest.fn();

    // create callback function
    const returnCallback1 = factory.propsFactory(
      mapStateToPropsWithCache,
      mapDispatchToPropsWithCache,
      mergePropsWithCache,
      mapStateToProps,
      mapDispatchToProps,
    );

    const returnCallback2 = returnCallback1(dispatch);

    const returnValue = returnCallback2(state, props);

    expect(mapStateToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapStateToPropsWithCache).toHaveBeenCalledWith(state, props, false);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledWith(dispatch, props, false);
    expect(mergePropsWithCache).toHaveBeenCalledTimes(1);
    expect(mergePropsWithCache).toHaveBeenCalledWith(mappedState, mappedDispatch, props);
    expect(mapStateToProps).toHaveBeenCalledTimes(0);
    expect(mapDispatchToProps).toHaveBeenCalledTimes(0);
    expect(dispatch).toHaveBeenCalledTimes(0);

    expect(returnValue).toEqual(result);
  });

  test('callback² function return a expected object (with two arguments by map*ToProps())', () => {
    const state = { a: 'lorem' };
    const props = { b: 42 };
    const mappedState = { c: 'ipsum' };
    const mappedDispatch = { d: 23 };
    const result = { e: [1, 2, 3] };

    // mocks
    const mapStateToPropsWithCache = jest.fn().mockReturnValue(mappedState);
    const mapDispatchToPropsWithCache = jest.fn().mockReturnValue(mappedDispatch);
    const mergePropsWithCache = jest.fn().mockReturnValue(result);
    const mapStateToProps = jest.fn((a, b) => ({ ...a, ...b }));
    const mapDispatchToProps = jest.fn((a, b) => ({ ...a, ...b }));
    const dispatch = jest.fn();

    // create callback function
    const returnCallback1 = factory.propsFactory(
      mapStateToPropsWithCache,
      mapDispatchToPropsWithCache,
      mergePropsWithCache,
      mapStateToProps,
      mapDispatchToProps,
    );

    const returnCallback2 = returnCallback1(dispatch);

    const returnValue = returnCallback2(state, props);

    expect(mapStateToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapStateToPropsWithCache).toHaveBeenCalledWith(state, props, true);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledWith(dispatch, props, true);
    expect(mergePropsWithCache).toHaveBeenCalledTimes(1);
    expect(mergePropsWithCache).toHaveBeenCalledWith(mappedState, mappedDispatch, props);
    expect(mapStateToProps).toHaveBeenCalledTimes(0);
    expect(mapDispatchToProps).toHaveBeenCalledTimes(0);
    expect(dispatch).toHaveBeenCalledTimes(0);

    expect(returnValue).toEqual(result);
  });

  test('callback² function return a expected object (with *WithCache()))', () => {
    // mocks
    const mapStateToProps = jest.fn((s, p) => ({ ...p, ...s }));
    const mapDispatchToProps = jest.fn((d, p) => ({ ...p, d }));
    const mergeProps = jest.fn((s, d, p) => ({ ...p, ...s, ...d }));
    const mapStateToPropsWithCache = jest.fn(
      factory.mapStateToPropsWithCacheFactory(mapStateToProps, isStrictEqual, shallowEqual),
    );
    const mapDispatchToPropsWithCache = jest.fn(
      factory.mapDispatchToPropsWithCacheFactory(mapDispatchToProps, shallowEqual),
    );
    const mergePropsWithCache = jest.fn(
      factory.mergePropsWithCacheFactory(mergeProps, shallowEqual, shallowEqual, shallowEqual),
    );
    const dispatch = jest.fn();

    // test data
    const state = { a: 'lorem' };
    const props = { b: 42 };
    const mappedState = { ...props, ...state };
    const mappedDispatch = { ...props, d: dispatch };
    const result = { ...props, ...state, d: dispatch };

    // create callback function
    const returnCallback1 = factory.propsFactory(
      mapStateToPropsWithCache,
      mapDispatchToPropsWithCache,
      mergePropsWithCache,
      mapStateToProps,
      mapDispatchToProps,
    );

    const returnCallback2 = returnCallback1(dispatch);

    const returnValue = returnCallback2(state, props);

    expect(mapStateToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapStateToPropsWithCache).toHaveBeenCalledWith(state, props, true);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledWith(dispatch, props, true);
    expect(mergePropsWithCache).toHaveBeenCalledTimes(1);
    expect(mergePropsWithCache).toHaveBeenCalledWith(mappedState, mappedDispatch, props);
    expect(mapStateToProps).toHaveBeenCalledTimes(1);
    expect(mapStateToProps).toHaveBeenCalledWith(state, props);
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, props);
    expect(mergeProps).toHaveBeenCalledTimes(1);
    expect(mergeProps).toHaveBeenCalledWith(mappedState, mappedDispatch, props);
    expect(dispatch).toHaveBeenCalledTimes(0);

    expect(returnValue).toEqual(result);
  });

  test('callback² function return a expected object (without mocks)', () => {
    // mocks
    const mapStateToProps = jest.fn(defaultMapStateToProps);
    const mapDispatchToProps = jest.fn(defaultMapDispatchToProps);
    const mergeProps = jest.fn(defaultMergeProps);
    const mapStateToPropsWithCache = jest.fn(
      factory.mapStateToPropsWithCacheFactory(mapStateToProps, isStrictEqual, shallowEqual),
    );
    const mapDispatchToPropsWithCache = jest.fn(
      factory.mapDispatchToPropsWithCacheFactory(mapDispatchToProps, shallowEqual),
    );
    const mergePropsWithCache = jest.fn(
      factory.mergePropsWithCacheFactory(mergeProps, shallowEqual, shallowEqual, shallowEqual),
    );
    const dispatch = jest.fn();

    // test data
    const state = { a: 'lorem' };
    const props = { b: 42, a: 'ipsum' };
    const mappedState = { state };
    const mappedDispatch = { dispatch };
    const result = { ...props, state, dispatch };

    // create callback function
    const returnCallback1 = factory.propsFactory(
      mapStateToPropsWithCache,
      mapDispatchToPropsWithCache,
      mergePropsWithCache,
      mapStateToProps,
      mapDispatchToProps,
    );

    const returnCallback2 = returnCallback1(dispatch);

    const returnValue = returnCallback2(state, props);

    expect(mapStateToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapStateToPropsWithCache).toHaveBeenCalledWith(state, props, false);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledTimes(1);
    expect(mapDispatchToPropsWithCache).toHaveBeenCalledWith(dispatch, props, false);
    expect(mergePropsWithCache).toHaveBeenCalledTimes(1);
    expect(mergePropsWithCache).toHaveBeenCalledWith(mappedState, mappedDispatch, props);
    expect(mapStateToProps).toHaveBeenCalledTimes(1);
    expect(mapStateToProps).toHaveBeenCalledWith(state, props);
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, props);
    expect(mergeProps).toHaveBeenCalledTimes(1);
    expect(mergeProps).toHaveBeenCalledWith(mappedState, mappedDispatch, props);
    expect(dispatch).toHaveBeenCalledTimes(0);

    expect(returnValue).toEqual(result);
  });
});
