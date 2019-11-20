import { actionSubjectType, storeDispatchType } from '../types';
import { hasProperty, isObject } from './helper';

export const defaultMapStateToProps = (): any => {
  return {};
};

export const defaultMapDispatchToProps = (): any => {
  return {};
};

export const mergeProps = <MapState, MapDispatch, ConnectedProps, ComponentProps>(
  stateProps: MapState,
  dispatchProps: MapDispatch,
  props: ConnectedProps,
) => {
  return ({ ...props, ...stateProps, ...dispatchProps } as any) as ComponentProps;
};

export const bindActions = <State, T extends Record<any, (...args: any[]) => actionSubjectType<State, any>>>(
  objs: T,
  dispatch: storeDispatchType<State, any>,
): T => {
  const data: any = {};

  Object.keys(objs).forEach((key) => {
    data[key] = (...args: any[]) => dispatch(objs[key](...args));
  });

  return data as T;
};

export const isStrictEqual = (a: any, b: any): boolean => {
  return a === b;
};

export const isEqual = (a: any, b: any): boolean => {
  if (isStrictEqual(a, b)) {
    return a !== 0 || b !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
};

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
