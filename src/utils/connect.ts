import { dispatchType, propsMergeReturnType } from './types';

//////////////////////
//
// CONNECT
//

/**
 *
 * @param state
 */
export function defaultMapStateToProps<S>(state: S): { state: S } {
  return { state };
}

/**
 *
 * @param dispatch
 */
export function defaultMapDispatchToProps(dispatch: dispatchType): { dispatch: dispatchType } {
  return { dispatch };
}

/**
 *
 * @param stateProps
 * @param dispatchProps
 * @param props
 */
export function defaultMergeProps<MS, MD, P>(
  stateProps: MS,
  dispatchProps: MD,
  props: P,
): propsMergeReturnType<MS, MD, P> {
  return Object.assign({}, props, stateProps, dispatchProps);
}

/**
 *
 * @param a
 * @param b
 */
export function isStrictEqual(a: any, b: any): boolean {
  return a === b;
}

/**
 *
 * @param a
 * @param b
 */
export function isEqual(a: any, b: any): boolean {
  if (isStrictEqual(a, b)) {
    return a !== 0 || b !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
}

/**
 *
 * @param a
 */
export function isObject(a: any): boolean {
  return typeof a === 'object' && a !== null;
}

/**
 *
 * @param a
 * @param key
 */
export function hasProperty(a: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(a, key);
}

/**
 *
 * @param a
 * @param b
 */
export function shallowEqual(a: any, b: any): boolean {
  if (isEqual(a, b)) {
    return true;
  }

  if (!isObject(a) || !isObject(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let key of keysA) {
    if (!hasProperty(b, key) || !isEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}
