import { createContext } from 'react';
import createConnect from './Connect';
import { createStoreHook } from './hooks/useDispatch';
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
  // https://reactjs.org/docs/context.html
  const context = createContext(store);

  // hooks
  const useStore = createStoreHook(context);

  // higher-order component
  const connect = createConnect(context);

  return {
    // dispatch
    dispatch: store.dispatch,
    // hooks
    useStore,
    // higher-order component
    connect,
    // React Context
    Consumer: context.Consumer,
    Provider: context.Provider,
  };
};

export default app;
