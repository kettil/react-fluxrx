import React, { createContext as defaultCreateContext } from 'react';
import { createStore as defaultCreateStore } from './store';
import { createConnect as defaultCreateConnect } from './connect';
import { createSubscription as createSubscriptionReact } from 'create-subscription';

import * as components from './libs/components';
import * as utilsConnect from './libs/connect';
import * as factory from './libs/factory';
import * as utilsMiddleware from './libs/middleware';
import * as utilsReducers from './libs/reducers';
import * as utilsStore from './libs/store';

import { reducerType, optionsType, storeType, middlewareActionType } from './libs/types';

export * from './libs/types';

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
  middlewares: middlewareActionType[] = [],
  {
    createContext = defaultCreateContext,
    createStore = defaultCreateStore,
    createConnect = defaultCreateConnect,

    middlewareHandler = utilsMiddleware.middlewareHandler,
    middlewareManager = utilsMiddleware.middlewareManager,
    reducerHandler = utilsReducers.reducerDefaultHandler,
    errorStoreHandler = utilsStore.errorStoreDefaultHandler(console.error),

    actionFilter = utilsStore.actionFilter,
    actionFlat = utilsStore.actionFlat,
    actionError = utilsStore.actionError,

    mapStateToProps = utilsConnect.defaultMapStateToProps,
    mapDispatchToProps = utilsConnect.defaultMapDispatchToProps,
    mergeProps = utilsConnect.defaultMergeProps,

    mapStateToPropsWithCacheFactory = factory.mapStateToPropsWithCacheFactory,
    mapDispatchToPropsWithCacheFactory = factory.mapDispatchToPropsWithCacheFactory,
    mergePropsWithCacheFactory = factory.mergePropsWithCacheFactory,
    propsFactory = factory.propsFactory,

    createElementWithoutSubscription = components.createElementWithoutSubscription,
    createElementWithSubscription = components.createElementWithSubscription,
    createSubscriptionWrapper = components.createSubscriptionWrapper,
    createSubscription = createSubscriptionReact,

    areStatesEqual = utilsConnect.isStrictEqual,
    arePropsEqual = utilsConnect.shallowEqual,
    areMappedEqual = utilsConnect.shallowEqual,
    areDispatchedEqual = utilsConnect.shallowEqual,
  }: optionsType<S>,
) {
  if (init === null) {
    // set default state, if it is not defined
    init = reducer(undefined, { type: '', payload: '' });
  }

  // init the store
  const store = createStore(reducer, init, middlewares, {
    actionError,
    actionFilter,
    actionFlat,
    errorStoreHandler,
    middlewareHandler,
    middlewareManager,
    reducerHandler,
  });

  // create a react context instance
  // https://reactjs.org/docs/context.html
  const context = createContext(store);
  const Consumer: React.Consumer<storeType<S>> = context.Consumer;
  const Provider: React.Provider<storeType<S>> = context.Provider;

  // creates the connect function for linking to the react component
  const connect = createConnect(Consumer, {
    areDispatchedEqual,
    areMappedEqual,
    arePropsEqual,
    areStatesEqual,
    createElementWithoutSubscription,
    createElementWithSubscription,
    createSubscription,
    createSubscriptionWrapper,
    mapDispatchToProps,
    mapDispatchToPropsWithCacheFactory,
    mapStateToProps,
    mapStateToPropsWithCacheFactory,
    mergeProps,
    mergePropsWithCacheFactory,
    propsFactory,
  });

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
