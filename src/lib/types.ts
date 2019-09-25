import { ComponentType } from 'react';
import { Observable, Subscription } from 'rxjs';

//
// Action
//

export type actionType<Payload = any> = {
  type: string | symbol;
  payload: Payload;

  sync?: boolean;
  withoutMiddleware?: boolean;
};

export type actionSubjectShortType<Payload = any> =
  | actionType<Payload>
  | Promise<actionType<Payload>>
  | Observable<actionType<Payload>>;

export type actionSubjectType<Payload = any> =
  | actionType<Payload>
  | Array<actionType<Payload>>
  | Promise<actionType<Payload>>
  | Observable<actionType<Payload>>;

export type withChildrenType<Props extends {}> = Props & { readonly children: React.ReactNode };

//
// Connect
//

export type connectedType<Props, MapState, MapDispatch> = (
  Element: ComponentType<MergedObjects<Props, MapState, MapDispatch>>,
) => ComponentType<Props>;

export type mapStateToPropsType<State, Props, MapState> = (state: State, ownProps: Props) => MapState;

export type mapDispatchToPropsType<Props, MapDispatch> = (dispatch: storeDispatchType, ownProps: Props) => MapDispatch;

export type mergePropsType<MapState, MapDispatch, Props> = (
  stateProps: MapState,
  dispatchProps: MapDispatch,
  ownProps: Props,
) => MergedObjects<Props, MapState, MapDispatch>;

export type wrappedComponentType<Props, MapState, MapDispatch> =
  | React.ComponentType<MergedObjects<Props, MapState, MapDispatch>>
  | React.ReactElement<MergedObjects<Props, MapState, MapDispatch>>;

//
// Store
//

export type storeDispatchType<Payload = any> = (action: actionSubjectType<Payload>) => void;

export type storeSubscribeType<State> = (state: State) => void;

export type storeType<State, Payload = any> = {
  subscribe: (next: storeSubscribeType<State>) => Subscription;
  dispatch: storeDispatchType<Payload>;
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

export type middlewareInitType<State, Payload = any> = (
  state: State,
  dispatch: storeDispatchType<Payload>,
  updateDirectly: storeSubscribeType<State>,
) => void;

export type middlewareActionType<State, Payload = any> = (
  action: actionType,
  state: State,
  dispatch: storeDispatchType<Payload>,
  reducer: reducerType<State>,
) => actionSubjectShortType;

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

export type MergedObjects<T1, T2, T3> = T3 & ObjectExcludeKeys<T2, T3> & ObjectExcludeKeys<T1, T2 & T3>;

export type ObjectExcludeKeys<T1, T2> = { [K in Exclude<keyof T1, keyof T2>]: T1[K] };

export type UnpackedArray<T> = T extends Array<infer U> ? U : T;

export type OptionalValues<T> = { [K in keyof T]?: T[K] };
