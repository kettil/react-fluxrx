import React, { createContext } from 'react';

import createConnect from './connect';
import createStore from './store';

import { middlewareType, reducerType, storeType } from './types';

/**
 *
 * @param reducer
 * @param init
 * @param options
 */
export const create = <State>(
  reducer: reducerType<State>,
  init?: State,
  {
    middlewares,
    timeDebounce,
  }: {
    middlewares?: Array<middlewareType<State>>;
    timeDebounce?: number;
  } = {},
) => {
  if (!init) {
    // set default state, if it is not defined
    init = reducer(undefined, { type: '', payload: undefined });
  }

  const store = createStore(reducer, init, middlewares, timeDebounce);

  // create a react context instance
  // https://reactjs.org/docs/context.html
  const context = createContext(store);
  const Consumer: React.Consumer<storeType<State>> = context.Consumer;
  const Provider: React.Provider<storeType<State>> = context.Provider;

  const connect = createConnect(context);

  return {
    // store
    store,
    // linking function to the react component
    connect,
    // React Context
    Provider,
    Consumer,
  };
};

/**
 *
 */
export default create;
