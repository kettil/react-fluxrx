import { Context, useMemo } from 'react';
import { OperatorFunction, Subject } from 'rxjs';
import { ActionFunctionType, ActionVoidType, StoreType } from '../types';
import { createDispatchHook } from './useDispatch';

type Ac<S, T extends any[]> = ActionFunctionType<S, T>;
type Vo<T extends any[]> = ActionVoidType<T>;
type Op<T1, T2> = OperatorFunction<T1, T2>;

// prettier-ignore
type HookType<S> = {
  <T extends any[]>(action: Ac<S, T>, op1: Op<T, T>): Vo<T>;
  <T extends any[], I extends any[] = T>(action: Ac<S, T>, op1: Op<I, T>): Vo<I>;
  <T extends any[], I extends any[], A>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, T>): Vo<I>;
  <T extends any[], I extends any[], A, B>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, B>, op3: Op<B, T>): Vo<I>;
  <T extends any[], I extends any[], A, B, C>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, B>, op3: Op<B, C>, op4: Op<C, T>): Vo<I>;
  <T extends any[], I extends any[], A, B, C, D>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, B>, op3: Op<B, C>, op4: Op<C, D>, op5: Op<D, T>): Vo<I>;
  <T extends any[], I extends any[], A, B, C, D, E>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, B>, op3: Op<B, C>, op4: Op<C, D>, op5: Op<D, E>, op6: Op<E, T>): Vo<I>;
  <T extends any[], I extends any[], A, B, C, D, E, F>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, B>, op3: Op<B, C>, op4: Op<C, D>, op5: Op<D, E>, op6: Op<E, F>, op7: Op<F, T>): Vo<I>;
  <T extends any[], I extends any[], A, B, C, D, E, F, G>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, B>, op3: Op<B, C>, op4: Op<C, D>, op5: Op<D, E>, op6: Op<E, F>, op7: Op<F, G>, op8: Op<G, T>): Vo<I>;
  <T extends any[], I extends any[], A, B, C, D, E, F, G, H>(action: Ac<S, T>, op1: Op<I, A>, op2: Op<A, B>, op3: Op<B, C>, op4: Op<C, D>, op5: Op<D, E>, op6: Op<E, F>, op7: Op<F, G>, op8: Op<G, H>, op9: Op<H, T>): Vo<I>;
};

export const createDispatchRxHook = <State>(context: Context<StoreType<State>>): HookType<State> => {
  const useDispatch = createDispatchHook(context);

  return <T extends any[], I extends any[]>(
    action: ActionFunctionType<State, T>,
    ...operators: any[]
  ): ActionVoidType<I> => {
    const callback = useDispatch(action);

    return useMemo(() => {
      const rx$ = new Subject<I>();

      operators.reduce((ob$, operator) => operator(ob$), rx$).subscribe((args: T) => callback(...args));

      return (...args: I) => {
        rx$.next(args);
      };
    }, [callback, action, ...operators]);
  };
};
