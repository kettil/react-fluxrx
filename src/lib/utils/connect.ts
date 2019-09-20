import { mergedObjects } from '../types';
import { hasProperty, isObject } from './helper';

/**
 *
 */
export const defaultMapStateToProps = (): any => {
  return {};
};

/**
 *
 */
export const defaultMapDispatchToProps = (): any => {
  return {};
};

/**
 *
 * @param stateProps
 * @param dispatchProps
 * @param props
 */
export const defaultMergeProps = <MapState, MapDispatch, Props>(
  stateProps: MapState,
  dispatchProps: MapDispatch,
  props: Props,
): mergedObjects<Props, MapState, MapDispatch> => {
  return { ...props, ...stateProps, ...dispatchProps };
};

/**
 *
 * @param a
 * @param b
 */
export const isStrictEqual = (a: any, b: any): boolean => {
  return a === b;
};

/**
 *
 * @param a
 * @param b
 */
export const isEqual = (a: any, b: any): boolean => {
  if (isStrictEqual(a, b)) {
    return a !== 0 || b !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
};
/**
 *
 * @param a
 * @param b
 */
export const shallowEqual = (a: any, b: any): boolean => {
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

  for (const key of keysA) {
    if (!hasProperty(b, key) || !isEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
};
