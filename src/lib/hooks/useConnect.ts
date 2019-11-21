import { useContext, useEffect, useMemo, useState } from 'react';
import selector from '../selector';
import { mapDispatchToPropsType, mapStateToPropsType, storeType } from '../types';
import { isStrictEqual } from '../utils/connect';

type Store<State, InnerProps, OuterProps> = {
  merge: InnerProps;
  state: State;
  outer: OuterProps;
};

export const useConnect = <State, InnerProps, OuterProps, MapState, MapDispatch>(
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

  useEffect(() => {
    // update the componentState only if props has changed
    updateProps(props.merge);
  }, [props.outer]);

  useEffect(() => {
    // update the componentState only if storeState has changed
    const subscription = store.subscribe((newState) => {
      if (!isStrictEqual(props.state, newState)) {
        updateProps(createProps(newState, props.outer));
      }
    });

    return () => subscription.unsubscribe();
  }, [store]);

  return innerProps;
};

export default useConnect;
