import { createContext } from 'react';
import { createDispatchHook } from './hooks/useDispatch';
import { createDispatchRxHook } from './hooks/useDispatchRx';
import { createSelectorHook } from './hooks/useSelector';
import { createStoreHook } from './hooks/useStore';
import createStore from './store';
import { MiddlewareType, ReducerType } from './types';

export const app = <State>(
  reducer: ReducerType<State>,
  init?: State,
  {
    middleware,
    timeDebounce,
  }: {
    middleware?: Array<MiddlewareType<State>>;
    timeDebounce?: number;
  } = {},
) => {
  if (!init) {
    // set default state, if it is not defined
    init = reducer(undefined, { type: '', payload: undefined });
  }

  const store = createStore(reducer, init, middleware, timeDebounce);

  // create a react context instance
  const context = createContext(store);

  // hooks
  const useStore = createStoreHook(context);
  const useSelector = createSelectorHook(context);
  const useDispatch = createDispatchHook(context);
  const useDispatchRx = createDispatchRxHook(context);

  return {
    // store
    store,
    // hooks
    useSelector,
    useStore,
    useDispatch,
    useDispatchRx,
    // React Context
    Consumer: context.Consumer,
    Provider: context.Provider,
  };
};

export default app;
