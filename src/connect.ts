import { Consumer } from 'react';

import {
  storeType,
  dispatchType,
  optionsConnectType,
  mapStateToPropsType,
  mapDispatchToPropsType,
  mergePropsType,
  connectedType,
} from './libs/types';

/**
 * TS-Type Legende
 *
 * <S>  = StateType
 * <P>  = PropsType
 * <MS> = MapStateType
 * <MD> = MapDispatchType
 *
 * @param Consumer
 * @param options
 */
export function createConnect<S>(Consumer: Consumer<storeType<S>>, options: optionsConnectType<S, any, any, any>) {
  return function connect<P = {}, MS = { state: S }, MD = { dispatch: dispatchType }>(
    mapStateToProps: null | mapStateToPropsType<S, P, MS> = options.mapStateToProps,
    mapDispatchToProps: mapDispatchToPropsType<P, MD> = options.mapDispatchToProps,
    mergeProps: mergePropsType<MS, MD, P> = options.mergeProps,
  ): connectedType<P, MS, MD> {
    if (mapStateToProps === null) {
      return options.createElementWithoutSubscription(Consumer, {
        ...options,
        mapDispatchToProps,
        mergeProps,
      });
    }

    return options.createElementWithSubscription(Consumer, {
      ...options,
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    });
  };
}
