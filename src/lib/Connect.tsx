import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { memo } from 'react';
import useConnect from './hooks/useConnect';
import { ExtractProps, MapDispatchToPropsType, MapStateToPropsType, StoreType } from './types';
import { defaultMapDispatchToProps, defaultMapStateToProps } from './utils/connect';

export const connectWrapper = <State,>(context: React.Context<StoreType<State>>) => {
  return <OProps extends Record<any, any>, MState = {}, MDispatch = {}>(
    mapStateToProps: MapStateToPropsType<State, OProps, MState> = defaultMapStateToProps,
    mapDispatchToProps: MapDispatchToPropsType<OProps, MDispatch> = defaultMapDispatchToProps,
  ) => {
    return <Component extends React.ComponentType<IProps>, IProps = ExtractProps<Component>>(Component: Component) => {
      return connect<Component, State, IProps, OProps, MState, MDispatch>(
        context,
        mapStateToProps,
        mapDispatchToProps,
        Component,
      );
    };
  };
};

export const connect = <Component extends React.ComponentType<IProps>, State, IProps, OProps, MState, MDispatch>(
  context: React.Context<StoreType<State>>,
  mapStateToProps: MapStateToPropsType<State, OProps, MState>,
  mapDispatchToProps: MapDispatchToPropsType<OProps, MDispatch>,
  Component: Component,
) => {
  const Consumer: React.FC<OProps> = (outerProps) => {
    const innerProps: IProps = useConnect(context, mapStateToProps, mapDispatchToProps, outerProps);

    return <Component {...(innerProps as any)} />;
  };

  const displayName = Component.displayName || Component.name;

  // istanbul ignore else
  if (displayName) {
    Consumer.displayName = displayName;
  }

  return hoistNonReactStatics(memo(Consumer), Component);
};

export default connectWrapper;
