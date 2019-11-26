import { Context, useContext, useEffect, useRef, useState } from 'react';
import { StoreType } from '../types';
import { isArrayEqual, isStrictEqual } from '../utils/equals';

type Ref<State, R> = {
  debs: readonly any[];
  props: R;
  state: State;
  selector: (state: State) => R;
};

export const createSelectorHook = <State>(context: Context<StoreType<State, any>>) => <R>(
  selector: (state: State) => R,
  debs: readonly any[] = [],
  isEqual = isStrictEqual,
): R => {
  const { getState, subscribe } = useContext(context);
  const ref = useRef<Ref<State, R>>({} as any).current;
  const state = getState();

  ref.selector = selector;

  if (ref.props === undefined || !isArrayEqual(debs, ref.debs) || !isStrictEqual(state, ref.state)) {
    ref.state = state;
    ref.props = ref.selector(ref.state);
    ref.debs = debs;
  }

  const [, update] = useState(ref.props);

  useEffect(() => {
    // update the data only if storeState has changed
    const subscription = subscribe((nextState) => {
      if (!isEqual(nextState, ref.state)) {
        ref.props = ref.selector(nextState);
        ref.state = nextState;

        update(ref.props);
      }
    });

    return () => subscription.unsubscribe();
  }, [subscribe]);

  return ref.props;
};
