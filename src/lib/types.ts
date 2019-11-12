/* tslint:disable:no-submodule-imports */
import { Observable, Subscription } from 'rxjs';
import { AjaxRequest } from 'rxjs/ajax';

//
// User Types
//

export type dispatchType = storeDispatchType;

export type ActionReturnType<T extends Record<string, any>> = {
  [K in keyof T]: ReturnType<T[K]>;
}[keyof T] &
  actionType;

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
  ajax?: {
    path: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: Record<string, any> | ((state: State) => Record<string, any> | void);
    options?: AjaxRequest;
    silent?: boolean;
    response?: (data: unknown, status: number, type: string) => actionSubjectType | actionSubjectType[];
  };
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

export type mapStateToPropsType<State, Props, MapState> = (state: State, ownProps: Props) => MapState;

export type mapDispatchToPropsType<Props, MapDispatch> = (dispatch: storeDispatchType, ownProps: Props) => MapDispatch;

export type ComponentConnected<MapState, MapDispatch, ConnectedProps, ComponentProps> = (
  props: RequiredProps<MapState, MapDispatch, ComponentProps> &
    PartialProps<MapState, MapDispatch, ComponentProps> &
    ConnectedProps,
) => JSX.Element;

export type RequiredProps<MapState, MapDispatch, Props> = {
  [K in Exclude<keyof Props, keyof MapState | keyof MapDispatch> &
    NonNullable<FilterRequired<Props>[keyof FilterRequired<Props>]>]: Props[K];
};

export type PartialProps<MapState, MapDispatch, Props> = {
  [K in Exclude<keyof Props, keyof MapState | keyof MapDispatch> &
    NonNullable<FilterPartial<Props>[keyof FilterPartial<Props>]>]?: Props[K];
};

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

export type ExtractProps<T> = T extends new (props: infer U1) => any
  ? U1
  : T extends (props: infer U2) => any
  ? U2
  : {};

export type UnpackedArray<T> = T extends Array<infer U> ? U : T;

export type FilterRequired<T> = {
  [K in keyof T]: Extract<T[K], undefined> extends never ? K : undefined;
};

export type FilterPartial<T> = {
  [K in keyof T]: Extract<T[K], undefined> extends never ? undefined : K;
};
