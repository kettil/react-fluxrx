import hoistNonReactStatic from 'hoist-non-react-statics';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';

import selector from './selector';
import { isStrictEqual } from './utils/connect';

import { ComponentConnected, mapDispatchToPropsType, mapStateToPropsType, storeType } from './types';

export const connector = <
  Component extends React.ComponentType<ComponentProps>,
  ComponentProps = {},
  State = {},
  ConnectedProps = {},
  MapState = {},
  MapDispatch = {}
>(
  Component: Component,
  context: React.Context<storeType<State>>,
  mapStateToProps: mapStateToPropsType<State, ConnectedProps, MapState>,
  mapDispatchToProps: mapDispatchToPropsType<ConnectedProps, MapDispatch>,
) => {
  const displayName = Component.displayName || Component.name || 'Component';

  const Consumer = (ownProps: ConnectedProps) => {
    const store = useContext(context);
    const storeState = store.getState();
    const createState = useMemo(
      () =>
        selector.create<State, ConnectedProps, MapState, MapDispatch, ComponentProps>(
          store.dispatch,
          mapStateToProps,
          mapDispatchToProps,
        ),
      [store],
    );

    const subscript = useMemo(() => ({}), []) as { update: (subscribeState: State) => void };
    const mapState = useMemo(() => createState(storeState, ownProps), [storeState, ownProps]);
    const [state, updateState] = useState(mapState);

    // subscription updater
    subscript.update = (subscribeState: State) => {
      if (!isStrictEqual(storeState, subscribeState)) {
        const nextState = createState(subscribeState, ownProps);

        if (!isStrictEqual(state, nextState)) {
          updateState(nextState);
        }
      }
    };

    useEffect(() => {
      // update the componentState only if props has changed
      updateState(mapState);
    }, [ownProps]);

    useEffect(() => {
      // update the componentState only if storeState has changed
      const subscription = store.subscribe((subscribeState) => subscript.update(subscribeState));

      return () => subscription.unsubscribe();
    }, [store]);

    const renderedWrappedComponent = useMemo(() => <Component {...(state as any)} />, [state]);

    return renderedWrappedComponent;
  };

  Consumer.displayName = 'Context.Consumer';
  const Connect = memo(Consumer);
  Connect.displayName = displayName;

  return (hoistNonReactStatic(Connect, Component) as any) as ComponentConnected<
    MapState,
    MapDispatch,
    ConnectedProps,
    ComponentProps
  >;
};

/**
 *
 */
export default connector;
