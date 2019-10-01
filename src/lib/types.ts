/* tslint:disable:no-submodule-imports */
import { ComponentType } from 'react';
import { Observable, Subscription } from 'rxjs';
import { AjaxRequest } from 'rxjs/ajax';

//
// User Types
//

export type createActionType<GlobalState, Payload> = actionSubjectType<
  GlobalState,
  OptionalValues<UnpackedArray<Payload>>
>;

export type createStateType<LocalState> = LocalState;

export type createReducerType<LocalState> = reducerType<LocalState, actionType<LocalState, UnpackedArray<LocalState>>>;

export type dispatchType = storeDispatchType;

//
// Action
//

export type actionType<State = any, Payload = any> = {
  type: TypeAction;
  payload: Payload;

  // options
  withoutMiddleware?: boolean;

  // socket.io
  sync?: boolean;

  // ajax
  ajaxUrlPath?: string;
  ajaxMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  ajaxData?: Record<string, any>;
  ajaxRequest?: (state: State) => Record<string, any> | void;
  ajaxOptions?: AjaxRequest;
  ajaxSilentMode?: boolean;
  ajaxResponse?: (
    responseData: unknown,
    responseStatus: number,
    responseType: string,
  ) => actionSubjectType | actionSubjectType[];
};

export type actionSubjectShortType<State = any, Payload = any> =
  | actionType<State, Payload>
  | Promise<actionType<State, Payload>>
  | Observable<actionType<State, Payload>>;

export type actionSubjectType<State = any, Payload = any> =
  | actionType<State, Payload>
  | Array<actionType<State, Payload>>
  | Promise<actionType<State, Payload>>
  | Observable<actionType<State, Payload>>;

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

export type storeDispatchType<State = any, Payload = any> = (action: actionSubjectType<State, Payload>) => void;

export type storeSubscribeType<State> = (state: State) => void;

export type storeType<State, Payload = any> = {
  subscribe: (next: storeSubscribeType<State>) => Subscription;
  dispatch: storeDispatchType<State, Payload>;
  getState: () => State;
};

export type storeSetStateType<State> = (state: State) => void;

export type storeErrorHandlerType<State> = (err: any, dispatch: storeDispatchType<State>, state: State) => void;

//
// Reducer
//

export type reducersType<State, Action extends actionType = any> = {
  [K in keyof State]: reducerType<State[K], Action>;
};

export type reducerType<State, Action extends actionType = any> = (state: State | undefined, action: Action) => State;

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
  dispatch: storeDispatchType<State, Payload>,
  updateDirectly: storeSubscribeType<State>,
) => void;

export type middlewareActionType<State, Payload = any> = (
  action: actionType,
  state: State,
  dispatch: storeDispatchType<State, Payload>,
  reducer: reducerType<State>,
) => actionSubjectShortType;

export type middlewareErrorType<State> = storeErrorHandlerType<State>;

//
// Helper
//

export type TypeAction = string | symbol;

export type MergedObjects<T1, T2, T3> = T3 & ObjectExcludeKeys<T2, T3> & ObjectExcludeKeys<T1, T2 & T3>;

export type ObjectExcludeKeys<T1, T2> = { [K in Exclude<keyof T1, keyof T2>]: T1[K] };

export type UnpackedArray<T> = T extends Array<infer U> ? U : T;

export type OptionalValues<T> = T extends { [K in keyof T]: any } ? { [K in keyof T]?: T[K] } : T;
