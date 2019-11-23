import { Context, useContext, useEffect, useMemo, useState } from 'react';
import { StoreType } from '../types';
import { isStrictEqual } from '../utils/connect';

export const createSelectorHook = <State>(context: Context<StoreType<State, any>>) => <R>(
  selector: (state: State) => R,
  isEqual = isStrictEqual,
): R => {
  const { getState, subscribe } = useContext(context);
  const [dataState, setDataState] = useState(getState());

  useEffect(() => {
    // update the data only if storeState has changed
    const subscription = subscribe((newState) => {
      if (!isEqual(newState, dataState)) {
        setDataState(newState);
      }
    });

    return () => subscription.unsubscribe();
  }, [subscribe]);

  return useMemo(() => selector(dataState), [selector, dataState]);
};
