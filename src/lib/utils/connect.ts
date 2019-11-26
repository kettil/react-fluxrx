import React, { FunctionComponent } from 'react';

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

export const memo = <C, W>(Component: FunctionComponent<C>, Wrapper: FunctionComponent<W>) => {
  const displayName = Component.displayName || Component.name;

  // istanbul ignore else
  if (displayName) {
    Wrapper.displayName = displayName;
  }

  return React.memo(Wrapper);
};
