import { useContext, useEffect, useMemo, useState } from 'react';
import selector from '../selector';
import { MapDispatchToPropsType, MapStateToPropsType, StoreType } from '../types';
import { isStrictEqual, shallowEqual } from '../utils/equals';

type Store<State, InnerProps, OuterProps> = {
  merge: InnerProps;
  state: State;
  outer: OuterProps;
};

export const useConnect = <State, InnerProps, OuterProps, MapState, MapDispatch>(
  context: React.Context<StoreType<State>>,
  mapStateToProps: MapStateToPropsType<State, OuterProps, MapState>,
  mapDispatchToProps: MapDispatchToPropsType<OuterProps, MapDispatch>,
  outerProps: OuterProps,
): InnerProps => {
  const props = useMemo(() => (({} as any) as Store<State, InnerProps, OuterProps>), []);
  const store = useContext(context);
  const createProps = useMemo(
    () =>
      selector.create<State, OuterProps, MapState, MapDispatch, InnerProps>(
        store.dispatch,
        mapStateToProps,
        mapDispatchToProps,
      ),
    [store],
  );

  props.state = store.getState();
  props.outer = shallowEqual(props.outer, outerProps) ? props.outer : outerProps;
  props.merge = useMemo(() => createProps(props.state, props.outer), [createProps, props.state, props.outer]);

  const [innerProps, updateProps] = useState(props.merge);

  useEffect(() => {
    // update the componentState only if props has changed
    updateProps(props.merge);
  }, [props.outer]);

  useEffect(() => {
    // update the componentState only if storeState has changed
    const subscription = store.subscribe((newState) => {
      if (!isStrictEqual(newState, props.state)) {
        updateProps(createProps(newState, props.outer));
      }
    });

    return () => subscription.unsubscribe();
  }, [store]);

  return innerProps;
};
