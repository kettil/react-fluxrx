import { Context, useMemo } from 'react';
import { OperatorFunction, Subject } from 'rxjs';
import { ActionFunctionType, ActionVoidType, StoreType } from '../types';
import { createDispatchHook } from './useDispatch';

export const createDispatchRxHook = <State>(context: Context<StoreType<State>>) => {
  const useDispatch = createDispatchHook(context);

  return <T extends any[]>(
    action: ActionFunctionType<State, T>,
    operator: OperatorFunction<T, T>,
    ...operatorArgs: Array<OperatorFunction<T, T>>
  ): ActionVoidType<T> => {
    const callback = useDispatch(action);

    return useMemo(() => {
      const rx$ = new Subject<T>();

      operatorArgs.reduce((ob$, opFn) => opFn(ob$), operator(rx$)).subscribe((args: T) => callback(...args));

      return (...args: T) => rx$.next(args);
    }, [callback, action, operator, ...operatorArgs]);
  };
};
