/* tslint:disable:no-submodule-imports */
import { ComponentType } from 'react';
import { Observable, Subscription } from 'rxjs';
import { AjaxRequest } from 'rxjs/ajax';

//
// User Types
//

export type createStateType<State> = State;

export type createActionType<Payload extends Record<string, any>, Type extends TypeAction> = actionSubjectType<
  OptionalValues<UnpackedArray<Payload>>,
  Type
>;

export type createReducerType<State extends Record<string, any>, Type extends TypeAction> = reducerType<
  State,
  actionType<UnpackedArray<State>, Type>
>;

export type dispatchType = storeDispatchType;

//
// Action
//

export type actionType<Payload extends Record<string, any> = any, Type extends TypeAction = TypeAction> = {
  type: Type;
  payload: Payload;

  // options
  withoutMiddleware?: boolean;

  // socket.io
  sync?: boolean;

  // ajax
  ajaxUrlPath?: string;
  ajaxMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  ajaxData?: Record<string, any>;
  ajaxRequest?: AjaxRequest;
  ajaxSilentMode?: boolean;
  ajaxResponse?: <D = any, P extends Record<string, any> = Payload, T extends TypeAction = Type>(
    responseStatus: number,
    responseData: Record<string, D>,
    responseType: string,
  ) => actionSubjectType<P, T>;
};

export type actionSubjectShortType<Payload extends Record<string, any> = any> =
  | actionType<Payload>
  | Promise<actionType<Payload>>
  | Observable<actionType<Payload>>;

export type actionSubjectType<Payload extends Record<string, any> = any, Type extends TypeAction = TypeAction> =
  | actionType<Payload, Type>
  | Array<actionType<Payload, Type>>
  | Promise<actionType<Payload, Type>>
  | Observable<actionType<Payload, Type>>;

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
// Helper
//

export type TypeAction = string | symbol;

export type MergedObjects<T1, T2, T3> = T3 & ObjectExcludeKeys<T2, T3> & ObjectExcludeKeys<T1, T2 & T3>;

export type ObjectExcludeKeys<T1, T2> = { [K in Exclude<keyof T1, keyof T2>]: T1[K] };

export type UnpackedArray<T> = T extends Array<infer U> ? U : T;

export type OptionalValues<T> = { [K in keyof T]?: T[K] };
