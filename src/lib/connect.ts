import React from 'react';

import connector from './Connector';
import { defaultMapDispatchToProps, defaultMapStateToProps, defaultMergeProps } from './utils/connect';

import {
  mapDispatchToPropsType,
  mapStateToPropsType,
  MergedObjects,
  mergePropsType,
  storeDispatchType,
  storeType,
  wrappedComponentType,
} from './types';

/**
 *
 * @param context
 */
export const createConnect = <State>(context: React.Context<storeType<State>>) => <
  Props = {},
  MapState = { state: State },
  MapDispatch = { dispatch: storeDispatchType }
>(
  mapStateToProps: mapStateToPropsType<State, Props, MapState> = defaultMapStateToProps,
  mapDispatchToProps: mapDispatchToPropsType<Props, MapDispatch> = defaultMapDispatchToProps,
  mergeProps: mergePropsType<MapState, MapDispatch, Props> = defaultMergeProps,
) => {
  return (WrappedComponent: wrappedComponentType<Props, MapState, MapDispatch>) =>
    connector(
      WrappedComponent as React.ComponentType<MergedObjects<Props, MapState, MapDispatch>>,
      context,
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    );
};

/**
 *
 */
export default createConnect;
