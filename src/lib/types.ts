import { ComponentType } from 'react';
import { Observable, Subscription } from 'rxjs';

//
// Action
//

export type actionType<PAYLOAD = any> = {
  type: string | symbol;
  payload: PAYLOAD;
};

export type actionSubjectType<PAYLOAD = any> = actionType<PAYLOAD> | Observable<actionType<PAYLOAD>>;

export type withChildrenType<Props extends {}> = Props & { readonly children: React.ReactNode };

//
// Connect
//

export type connectedType<Props, MapState, MapDispatch> = (
  Element: ComponentType<mergedObjects<Props, MapState, MapDispatch>>,
) => ComponentType<Props>;

export type mapStateToPropsType<State, Props, MapState> = (state: State, ownProps: Props) => MapState;

export type mapDispatchToPropsType<Props, MapDispatch> = (dispatch: storeDispatchType, ownProps: Props) => MapDispatch;

export type mergePropsType<MapState, MapDispatch, Props> = (
  stateProps: MapState,
  dispatchProps: MapDispatch,
  ownProps: Props,
) => mergedObjects<Props, MapState, MapDispatch>;

export type wrappedComponentType<Props, MapState, MapDispatch> =
  | React.ComponentType<mergedObjects<Props, MapState, MapDispatch>>
  | React.ReactElement<mergedObjects<Props, MapState, MapDispatch>>;

//
// Store
//

export type storeDispatchType<PAYLOAD = any> = (action: actionSubjectType<PAYLOAD>) => void;

export type storeSubscribeType<State> = (state: State) => void;

export type storeType<State, PAYLOAD = any> = {
  subscribe: (next: storeSubscribeType<State>) => Subscription;
  dispatch: storeDispatchType<PAYLOAD>;
  getState: () => State;
};

export type storeSetStateType<State> = (state: State) => void;

export type storeErrorHandlerType<State> = (err: any, dispatch: storeDispatchType, state: State) => void;

//
// Middleware
//

export type middlewareType<State> = {
  init?: middlewareInitType<State>;
  action?: middlewareActionType<State>;
  error?: middlewareErrorType<State>;
};

export type middlewareInitType<State, PAYLOAD = any> = (
  state: State,
  dispatch: storeDispatchType<PAYLOAD>,
  setState: storeSubscribeType<State>,
  updateDirectly: storeSubscribeType<State>,
) => void;

export type middlewareActionType<State, PAYLOAD = any> = (
  action: actionType,
  state: State,
  dispatch: storeDispatchType<PAYLOAD>,
  reducer: reducerType<State>,
) => actionSubjectType;

export type middlewareErrorType<State> = storeErrorHandlerType<State>;

//
// Reducer
//

export type reducersType<State, ACTION extends actionType = any> = {
  [K in keyof State]: reducerType<State[K], ACTION>;
};

export type reducerType<State, ACTION extends actionType = any> = (state: State | undefined, action: ACTION) => State;

//
// Helper
//

export type mergedObjects<T1, T2, T3> = T3 & objectExcludeKeysType<T2, T3> & objectExcludeKeysType<T1, T2 & T3>;

export type objectExcludeKeysType<T1, T2> = { [K in Exclude<keyof T1, keyof T2>]: T1[K] };
