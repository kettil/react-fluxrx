import { Context } from 'react';
import { debounceTime } from 'rxjs/operators';
import { ActionFunctionType, StoreType } from '../types';
import { createDispatchRxHook } from './useDispatchRx';

export const createDispatchDebounceHook = <State>(context: Context<StoreType<State>>) => {
  const useDispatchRx = createDispatchRxHook(context);

  return <T extends any[]>(action: ActionFunctionType<State, T>, delay: number) => {
    return useDispatchRx(action, debounceTime(delay));
  };
};
