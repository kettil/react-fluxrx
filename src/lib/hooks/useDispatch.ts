import { Context, useCallback, useContext } from 'react';
import { ActionFunctionType, ActionVoidType, StoreDispatchType, StoreType } from '../types';

type HookType<State> = {
  (): StoreDispatchType<State, any>;
  <T extends any[]>(action?: ActionFunctionType<State, T>): ActionVoidType<T>;
};

export const createDispatchHook = <State>(context: Context<StoreType<State, any>>): HookType<State> => (
  action?: any,
) => {
  const { dispatch } = useContext(context);

  if (typeof action === 'undefined') {
    return dispatch;
  }

  return useCallback((...args: any[]) => dispatch(action(...args)), [action]);
};
