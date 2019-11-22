import { createContext } from 'react';
import createConnect from './Connect';
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
  const connect = createConnect(context);

  return {
    // dispatch
    dispatch: store.dispatch,
    // higher-order component
    connect,
    // React Context
    Consumer: context.Consumer,
    Provider: context.Provider,
  };
};

export default app;
