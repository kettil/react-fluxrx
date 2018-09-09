import React, { createContext as defaultCreateContext } from 'react';
import { createStore as defaultCreateStore } from './store';
import { createConnect as defaultCreateConnect } from './connect';

import { errorStoreDefaultHandler } from './utils/store';
import * as factory from './utils/factory';
import { middlewareHandler, middlewareManager } from './utils/middleware';
import {
  defaultMapStateToProps,
  defaultMapDispatchToProps,
  defaultMergeProps,
  isStrictEqual,
  shallowEqual,
} from './utils/connect';
import { actionFlat, actionFilter, actionError } from './utils/store';
import { reducerType, optionsType, storeType, middlewareActionType } from './utils/types';

export * from './utils/types';

/**
 * TS-Type Legende
 *
 * <S> = StateType
 * <P>  = PropsType
 * <MS> = MapStateType
 * <MD> = MapDispatchType
 *
 * @param reducer
 * @param init
 * @param options
 */
export default function<S>(
  reducer: reducerType<S>,
  init: S | null = null,
  middleware: middlewareActionType[] = [],
  options: optionsType<S> = {
    createContext: defaultCreateContext,
    createStore: defaultCreateStore,
    createConnect: defaultCreateConnect,

    middlewareHandler: middlewareHandler,
    middlewareManager: middlewareManager,
    errorHandler: errorStoreDefaultHandler(console.error),

    actionFilter: actionFilter,
    actionFlat: actionFlat,
    actionError: actionError,

    mapStateToProps: defaultMapStateToProps,
    mapDispatchToProps: defaultMapDispatchToProps,
    mergeProps: defaultMergeProps,

    mapStateToPropsWithCacheFactory: factory.mapStateToPropsWithCacheFactory,
    mapDispatchToPropsWithCacheFactory: factory.mapDispatchToPropsWithCacheFactory,
    mergePropsWithCacheFactory: factory.mergePropsWithCacheFactory,
    propsFactory: factory.propsFactory,

    areStatesEqual: isStrictEqual,
    arePropsEqual: shallowEqual,
    areMappedEqual: shallowEqual,
    areDispatchedEqual: shallowEqual,
  },
) {
  if (init === null) {
    // set default state, if it is not defined
    init = reducer(undefined, { type: '', payload: '' });
  }

  // init the store
  const store = options.createStore(reducer, init, middleware, options);

  // create a react context instance
  // https://reactjs.org/docs/context.html
  const context = options.createContext(store);
  const Consumer: React.Consumer<storeType<S>> = context.Consumer;
  const Provider: React.Provider<storeType<S>> = context.Provider;

  // creates the connect function for linking to the react component
  const connect = options.createConnect(Consumer, options);

  return {
    // store
    store,
    // linking function to the react component
    connect,
    // React Context
    Provider,
    Consumer,
  };
}
