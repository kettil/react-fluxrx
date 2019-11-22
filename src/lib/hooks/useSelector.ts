import { Context, useContext, useEffect, useMemo, useState } from 'react';
import { StoreType } from '../types';

export const createSelectorHook = <State>(context: Context<StoreType<State, any>>) => <P extends object | undefined, R>(
  selector: (state: State, props: P) => R,
  props: P,
): R => {
  const { getState, subscribe } = useContext(context);
  const [dataState, setDataState] = useState(getState());

  useEffect(() => {
    // update the data only if storeState has changed
    const subscription = subscribe((newState) => setDataState(newState));

    return () => subscription.unsubscribe();
  }, [subscribe]);

  return useMemo(() => selector(dataState, props), [selector, dataState, props]);
};
