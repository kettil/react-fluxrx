import { Subscription as SubscriptionReact, SubscriptionConfig } from 'create-subscription';
import { Observable, ObservableInput, Subscription } from 'rxjs';

//////////////////////
//
// INDEX
//

/**
 *
 */
export type optionsType<S> = {
  createContext?: createContextType<storeType<S>>;
  createStore?: createStoreType<S>;
  createConnect?: createConnectType<S>;

  mapStateToProps?: mapStateToPropsType<S, any, any>;
  mapDispatchToProps?: mapDispatchToPropsType<any, any>;
  mergeProps?: mergePropsType<any, any, any>;

  mapStateToPropsWithCacheFactory?: mapStateToPropsWithCacheFactoryType<S, any, any>;
  mapDispatchToPropsWithCacheFactory?: mapDispatchToPropsWithCacheFactoryType<any, any>;
  mergePropsWithCacheFactory?: mergePropsWithCacheFactoryType<any, any, any>;
  propsFactory?: propsFactoryType<S, any, any, any>;

  createElementWithoutSubscription?: createElementWithoutSubscriptionType<S, any, any, any>;
  createElementWithSubscription?: createElementWithSubscriptionType<S, any, any, any>;
  createSubscriptionWrapper?: createSubscriptionWrapperType<S, any, any, any>;
  createSubscription?: createSubscriptionType<S, any, any, any>;

  areStatesEqual?: equalType<S, S>;
  arePropsEqual?: equalType<any, any>;
  areMappedEqual?: equalType<any, any>;
  areDispatchedEqual?: equalType<any, any>;

  middlewareManager?: middlewareManagerType;
  middlewareHandler?: middlewareHandlerType;

  reducerHandler?: reducerHandlerType<S>;
  errorStoreHandler?: errorHandlerType;

  actionFilter?: actionValidatorType;
  actionFlat?: actionFlatType;
  actionError?: actionErrorType;
};

/**
 *
 */
export type optionsConnectType<S, P, MS, MD> = {
  mapStateToProps: mapStateToPropsType<S, P, MS>;
  mapDispatchToProps: mapDispatchToPropsType<P, MD>;
  mergeProps: mergePropsType<MS, MD, P>;

  mapStateToPropsWithCacheFactory: mapStateToPropsWithCacheFactoryType<S, P, MS>;
  mapDispatchToPropsWithCacheFactory: mapDispatchToPropsWithCacheFactoryType<P, MD>;
  mergePropsWithCacheFactory: mergePropsWithCacheFactoryType<P, MS, MD>;
  propsFactory: propsFactoryType<S, P, MS, MD>;

  createElementWithoutSubscription: createElementWithoutSubscriptionType<S, P, MS, MD>;
  createElementWithSubscription: createElementWithSubscriptionType<S, P, MS, MD>;
  createSubscriptionWrapper: createSubscriptionWrapperType<S, P, MS, MD>;
  createSubscription: createSubscriptionType<S, P, MS, MD>;

  areStatesEqual: equalType<S, S>;
  arePropsEqual: equalType<P, P>;
  areMappedEqual: equalType<MS, MS>;
  areDispatchedEqual: equalType<MD, MD>;
};

/**
 *
 */
export type optionsStoreType<S> = {
  middlewareManager: middlewareManagerType;
  middlewareHandler: middlewareHandlerType;

  reducerHandler: reducerHandlerType<S>;
  errorStoreHandler: errorHandlerType;

  actionFilter: actionValidatorType;
  actionFlat: actionFlatType;
  actionError: actionErrorType;
};

/**
 *
 */
export type createContextType<T> = (
  defaultValue: T,
  calculateChangedBits?: ((prev: T, next: T) => number) | undefined,
) => React.Context<T>;

/**
 *
 */
export type equalType<A = any, B = any> = (a: A, b: B) => boolean;

/**
 *
 */
export type logType = (a: any) => void;

//////////////////////
//
// CONNECT
//

export type createConnectType<S> = (
  Consumer: React.ComponentType<React.ConsumerProps<storeType<S>>>,
  options: optionsConnectType<S, any, any, any>,
) => <P, MS, MD>(
  mapStateToProps?: mapStateToPropsType<S, P, MS> | null,
  mapDispatchToProps?: mapDispatchToPropsType<P, MD>,
  mergeProps?: mergePropsType<MS, MD, P>,
) => connectedType<P, MS, MD>;

/**
 *
 */
export type createElementWithoutSubscriptionType<S, P, MS, MD> = (
  Consumer: React.ComponentType<React.ConsumerProps<storeType<S>>>,
  options: optionsConnectType<S, P, MS, MD>,
) => (Element: React.ComponentType<propsMergeReturnType<P, MS, MD>>) => React.ComponentType<P>;

/**
 *
 */
export type createElementWithSubscriptionType<S, P, MS, MD> = (
  Consumer: React.ComponentType<React.ConsumerProps<storeType<S>>>,
  options: optionsConnectType<S, P, MS, MD>,
) => (Element: React.ComponentType<propsMergeReturnType<P, MS, MD>>) => React.ComponentType<P>;

/**
 *
 */
export type subscriptionType<S, P> = {
  store: storeType<S>;
  ownProps: P;
};

/**
 *
 */
export type createSubscriptionType<S, P, MS, MD> = (
  config: SubscriptionConfig<subscriptionType<S, P>, propsMergeReturnType<P, MS, MD>>,
) => SubscriptionReact<subscriptionType<S, P>, propsMergeReturnType<P, MS, MD>>;

/**
 *
 */
export type createSubscriptionWrapperType<S, P, MS, MD> = (
  createSubscription: createSubscriptionType<S, P, MS, MD>,
  merge: propsMergeType<S, P, MS, MD>,
) => SubscriptionReact<subscriptionType<S, P>, propsMergeReturnType<P, MS, MD>>;

/**
 *
 */
export type connectedType<P, MS, MD> = (
  Element: React.ComponentType<propsMergeReturnType<P, MS, MD>>,
) => React.ComponentType<P>;

/**
 *
 */
export type mapStateToPropsType<S, P, MS> = (state: S, ownProps: P) => MS;

/**
 *
 */
export type mapDispatchToPropsType<P, MD> = (dispatch: dispatchType, ownProps: P) => MD;

/**
 *
 */
export type mergePropsType<MS, MD, P> = (
  stateProps: MS,
  dispatchProps: MD,
  ownProps: P,
) => propsMergeReturnType<P, MS, MD>;

/**
 * @todo change type name
 */
export type propsMergeType<S, P, MS, MD> = (nextState: S, nextProps: P) => propsMergeReturnType<P, MS, MD>;

/**
 *
 */
export type propsMergeReturnType<T1, T2, T3> = T3 & objectExcludeKEysType<T2, T3> & objectExcludeKEysType<T1, T2 & T3>;

/**
 *
 */
export type objectExcludeKEysType<T1, T2> = { [K in Exclude<keyof T1, keyof T2>]: T1[K] };

//////////////////////
//
// FACTORY
//

/**
 *
 */
export type mapStateToPropsWithCacheFactoryType<S, P, MS> = (
  mapStateToProps: mapStateToPropsType<S, P, MS>,
  areStatesEqual: equalType<S, S>,
  arePropsEqual: equalType<P, P>,
) => mapStateToPropsWithCacheType<S, P, MS>;

/**
 *
 */
export type mapStateToPropsWithCacheType<S, P, MS> = (nextState: S, nextProps: P, hasDependsOnProps: boolean) => MS;

/**
 *
 */
export type mapDispatchToPropsWithCacheFactoryType<P, MD> = (
  mapDispatchToProps: mapDispatchToPropsType<P, MD>,
  arePropsEqual: equalType<P, P>,
) => mapDispatchToPropsWithCacheType<P, MD>;

/**
 *
 */
export type mapDispatchToPropsWithCacheType<P, MD> = (
  dispatch: dispatchType,
  nextProps: P,
  hasDependsOnProps: boolean,
) => MD;

/**
 *
 */
export type mergePropsWithCacheFactoryType<P, MS, MD> = (
  mergeProps: mergePropsType<MS, MD, P>,
  arePropsEqual: equalType<P, P>,
  areMappedEqual: equalType<MS, MS>,
  areDispatchedEqual: equalType<MD, MD>,
) => mergePropsWithCacheType<MS, MD, P>;

/**
 *
 */
export type mergePropsWithCacheType<MS, MD, P> = (
  stateMapped: MS,
  dispatchMapped: MD,
  props: P,
) => propsMergeReturnType<P, MS, MD>;

/**
 *
 */
export type propsFactoryType<S, P, MS, MD> = (
  mapStateToPropsWithCache: mapStateToPropsWithCacheType<S, P, MS>,
  mapDispatchToPropsWithCache: mapDispatchToPropsWithCacheType<P, MD>,
  mergePropsWithCache: mergePropsWithCacheType<MS, MD, P>,
  mapStateToProps: mapStateToPropsType<S, P, MS>,
  mapDispatchToProps: mapDispatchToPropsType<P, MD>,
) => propsFactoryDispatchType<S, P, MS, MD>;

/**
 *
 */
export type propsFactoryDispatchType<S, P, MS, MD> = (dispatch: dispatchType) => propsFactoryUpdateType<S, P, MS, MD>;

/**
 *
 */
export type propsFactoryUpdateType<S, P, MS, MD> = (nextState: S, nextProps: P) => propsMergeReturnType<P, MS, MD>;

//////////////////////
//
// MIDDLEWARE
//

/**
 *
 */
export type middlewareActionType = (action: actionType, dispatch: dispatchType) => actionSubjectType;

/**
 *
 */
export type middlewareManagerType = (
  dispatch: dispatchType,
  middlewares: middlewareActionType[],
  actionValidator: actionValidatorType,
  middlewareHandler: middlewareHandlerType,
) => (source$: Observable<actionType>) => Observable<actionType>;

/**
 *
 */
export type middlewareHandlerType = (
  dispatch: dispatchType,
  middlewares: middlewareActionType,
  actionValidator: actionValidatorType,
  source$: Observable<actionType>,
) => Observable<actionType>;

//////////////////////
//
// REDUCERS
//

/**
 *
 */
export type reducerHandlerType<S> = (reducer: reducerType<S>) => reducerType<S>;

/**
 *
 */
export type reducersType<S> = {
  [key: string]: reducerType<S>;
};

/**
 *
 */
export type reducerType<S> = (state: S | undefined, action: actionType) => S;

//////////////////////
//
// STORE
//

/**
 *
 */
export type createStoreType<S> = (
  reducer: reducerType<S>,
  init: S,
  middleware: middlewareActionType[],
  options: optionsStoreType<S>,
) => storeType<S>;

/**
 *
 */
export type actionType = {
  type: string;
  payload: any;
};

/**
 *
 */
export type actionSubjectType = actionType | Observable<actionType>;

/**
 *
 */
export type dispatchType = (action: actionSubjectType) => void;

/**
 *
 */
export type subscribeType<S> = (state: S) => void;

/**
 *
 */
export type storeType<S> = {
  subscribe: (next: subscribeType<S>) => Subscription;
  dispatch: dispatchType;
  getState: () => S;
};

/**
 *
 */
export type actionValidatorType = (action: any) => action is actionType;

/**
 *
 */
export type actionFlatType = (action: actionSubjectType) => Observable<actionType>;

/**
 *
 */
export type actionErrorType = (
  errorHandler: errorHandlerType,
  dispatch: dispatchType,
) => (error: any, action$: Observable<actionType>) => ObservableInput<actionType>;

/**
 *
 */
export type errorHandlerType = (error: any, dispatch: dispatchType) => void;
