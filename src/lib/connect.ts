import React from 'react';

import connector from './Connector';
import { defaultMapDispatchToProps, defaultMapStateToProps } from './utils/connect';

import { ComponentConnected, ExtractProps, mapDispatchToPropsType, mapStateToPropsType, storeType } from './types';

export const createConnect = <State>(context: React.Context<storeType<State>>) => {
  return <ConnectedProps extends Record<any, any>, MapState = {}, MapDispatch = {}>(
    mapStateToProps: mapStateToPropsType<State, ConnectedProps, MapState> = defaultMapStateToProps,
    mapDispatchToProps: mapDispatchToPropsType<ConnectedProps, MapDispatch> = defaultMapDispatchToProps,
  ) => {
    return <Component extends React.ComponentType<ComponentProps>, ComponentProps = ExtractProps<Component>>(
      Component: Component,
    ): ComponentConnected<MapState, MapDispatch, ConnectedProps, ComponentProps> =>
      connector<Component, ComponentProps, State, ConnectedProps, MapState, MapDispatch>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );
  };
};

export default createConnect;
