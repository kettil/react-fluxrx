import React, { createContext } from 'react';
import createConnect from './Connect';
import createStore from './store';
import { middlewareType, reducerType, storeType } from './types';

export const app = <State>(
  reducer: reducerType<State>,
  init?: State,
  {
    middleware,
    timeDebounce,
  }: {
    middleware?: Array<middlewareType<State>>;
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
  const Consumer: React.Consumer<storeType<State>> = context.Consumer;
  const Provider: React.Provider<storeType<State>> = context.Provider;

  const connect = createConnect(context);

  return {
    // store
    store,
    // ho-component
    connect,
    // React Context
    Provider,
    Consumer,
  };
};

export default app;
