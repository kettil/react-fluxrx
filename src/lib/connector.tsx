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
    const memoProps = useMemo(() => ownProps, [ownProps]);
    const createState = useMemo(
      () => selector.create(store.dispatch, mapStateToProps, mapDispatchToProps, mergeProps),
      [store],
    );

    const [state, updateState] = useState(createState(store.getState(), memoProps));

    useEffect(() => {
      const subscription = store.subscribe((rawState) => {
        const newState = createState(rawState, memoProps);

        if (!isStrictEqual(state, newState)) {
          updateState(newState);
        }
      });

      return () => subscription.unsubscribe();
    }, [store]);

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
