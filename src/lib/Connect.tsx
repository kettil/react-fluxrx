import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { memo } from 'react';
import { ExtractProps, mapDispatchToPropsType, mapStateToPropsType, storeType } from './types';
import { defaultMapDispatchToProps, defaultMapStateToProps } from './utils/connect';
import useStore from './utils/useStore';

export const connectorWrapper = <State,>(context: React.Context<storeType<State>>) => {
  return <OProps extends Record<any, any>, MState = {}, MDispatch = {}>(
    mapStateToProps: mapStateToPropsType<State, OProps, MState> = defaultMapStateToProps,
    mapDispatchToProps: mapDispatchToPropsType<OProps, MDispatch> = defaultMapDispatchToProps,
  ) => {
    return <Component extends React.ComponentType<IProps>, IProps = ExtractProps<Component>>(Component: Component) => {
      return connector<Component, State, IProps, OProps, MState, MDispatch>(
        context,
        mapStateToProps,
        mapDispatchToProps,
        Component,
      );
    };
  };
};

export const connector = <Component extends React.ComponentType<IProps>, State, IProps, OProps, MState, MDispatch>(
  context: React.Context<storeType<State>>,
  mapStateToProps: mapStateToPropsType<State, OProps, MState>,
  mapDispatchToProps: mapDispatchToPropsType<OProps, MDispatch>,
  Component: Component,
) => {
  const Consumer: React.FC<OProps> = (outerProps) => {
    const innerProps: IProps = useStore(context, mapStateToProps, mapDispatchToProps, outerProps);

    return <Component {...(innerProps as any)} />;
  };

  const displayName = Component.displayName || Component.name;

  // istanbul ignore else
  if (displayName) {
    Consumer.displayName = displayName;
  }

  return hoistNonReactStatics(memo(Consumer), Component);
};

export default connectorWrapper;
