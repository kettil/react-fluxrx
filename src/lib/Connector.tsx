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
    const storeState = store.getState();

    const createState = useMemo(
      () => selector.create(store.dispatch, mapStateToProps, mapDispatchToProps, mergeProps),
      [store],
    );

    const subscript = useMemo(
      () => ({
        update: (_: State) => {
          /* dummy function */
        },
      }),
      [],
    );

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
