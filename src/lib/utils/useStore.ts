import { useContext, useEffect, useMemo, useState } from 'react';
import selector from '../selector';
import { mapDispatchToPropsType, mapStateToPropsType, storeType } from '../types';
import { isStrictEqual } from './connect';

type Store<State, InnerProps, OuterProps> = {
  merge: InnerProps;
  state: State;
  inner: InnerProps;
  outer: OuterProps;
};

export const useStore = <State, InnerProps, OuterProps, MapState, MapDispatch>(
  context: React.Context<storeType<State>>,
  mapStateToProps: mapStateToPropsType<State, OuterProps, MapState>,
  mapDispatchToProps: mapDispatchToPropsType<OuterProps, MapDispatch>,
  outerProps: OuterProps,
): InnerProps => {
  const store = useContext(context);
  const props = useMemo(() => (({} as any) as Store<State, InnerProps, OuterProps>), []);
  const createProps = useMemo(
    () =>
      selector.create<State, OuterProps, MapState, MapDispatch, InnerProps>(
        store.dispatch,
        mapStateToProps,
        mapDispatchToProps,
      ),
    [store],
  );

  props.outer = outerProps;
  props.state = store.getState();
  props.merge = useMemo(() => createProps(props.state, props.outer), [createProps, props.state, props.outer]);

  const [innerProps, updateProps] = useState(props.merge);

  props.inner = innerProps;

  useEffect(() => {
    // update the componentState only if props has changed
    updateProps(props.merge);
  }, [props.outer]);

  useEffect(() => {
    // update the componentState only if storeState has changed
    const subscription = store.subscribe((newState) => {
      if (!isStrictEqual(props.state, newState)) {
        const newProps = createProps(newState, props.outer);

        if (!isStrictEqual(props.inner, newProps)) {
          updateProps(newProps);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [store]);

  return props.inner;
};

export default useStore;
