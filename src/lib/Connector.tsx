import hoistNonReactStatic from 'hoist-non-react-statics';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';

import { isStrictEqual } from './utils/connect';

import selector from './selector';

import { mapDispatchToPropsType, mapStateToPropsType, mergedObjects, mergePropsType, storeType } from './types';

/**
 *
 * @param WrappedComponent
 * @param context
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @param mergeProps
 */
export const connector = <State, Props, MapState, MapDispatch>(
  WrappedComponent: React.ComponentType<mergedObjects<Props, MapState, MapDispatch>>,
  context: React.Context<storeType<State>>,
  mapStateToProps: mapStateToPropsType<State, Props, MapState>,
  mapDispatchToProps: mapDispatchToPropsType<Props, MapDispatch>,
  mergeProps: mergePropsType<MapState, MapDispatch, Props>,
): React.ComponentType<Props> => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const Consumer = (ownProps: Props) => {
    const store = useContext(context);
    const createState = useMemo(
      () => selector.create(store.dispatch, mapStateToProps, mapDispatchToProps, mergeProps),
      [store],
    );

    const lastState = useMemo(() => createState(store.getState(), ownProps), [store.getState(), ownProps]);

    const [state, updateState] = useState(lastState);

    useEffect(() => {
      updateState(lastState);
    }, [lastState]);

    useEffect(() => {
      const subscription = store.subscribe((rawState) => {
        const newState = createState(rawState, ownProps);

        if (!isStrictEqual(state, newState)) {
          updateState(newState);
        }
      });

      return () => subscription.unsubscribe();
    }, [store, ownProps]);

    const renderedWrappedComponent = useMemo(() => <WrappedComponent {...state} />, [state]);

    return renderedWrappedComponent;
  };

  Consumer.displayName = 'Context.Consumer';
  const Connect = memo(Consumer);
  Connect.displayName = displayName;

  return hoistNonReactStatic(Connect, WrappedComponent) as any;
};

/**
 *
 */
export default connector;
