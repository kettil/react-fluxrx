import { Observable, Subscription } from 'rxjs';
import { AjaxError, AjaxRequest } from 'rxjs/ajax';

//
// Factory
//

export type GetStateTypeFactory<State> = GetStateType<State>;

export type ActionTypeFactory<State> = ActionType<State>;

// This typing extracts the action objects from the action functions
export type ActionReturnType<State, T extends Record<string, any>> = {
  [K in keyof T]: AFilter<ARules<State, ReturnType<T[K]>>>;
}[keyof T];

type ARPromise<V, O> = V extends Promise<infer S> ? ARObservable<S, S> : O;
type ARObservable<V, O> = V extends Observable<infer S> ? S : O;
type ARFunction<S, V, O> = ARFunctionState<S, V, ARFunctionOther<V, O>>;
type ARFunctionState<S, V, O> = V extends (getState: GetStateType<S>) => infer R ? ARPromise<R, ARObservable<R, R>> : O;
type ARFunctionOther<V, O> = V extends () => void ? never : O;
type ARules<S, V> = ARPromise<V, ARObservable<V, ARFunction<S, V, V>>>;
type AFilter<V> = V extends { type: string } ? V : never;

//
// Action
//

export type ActionType<State = any, Payload = any> = {
  type: TypeAction;
  payload: Payload;

  // socket.io
  ws?:
    | boolean
    | {
        // overwrite the type in the websocket context
        type?: TypeAction;
        // overwrite the payload in the websocket context
        payload?: Payload;
      };

  // ajax
  ajax?: {
    path: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: Record<string, any> | ((state: State) => Record<string, any> | void);
    options?: AjaxRequest;
    silent?: boolean;
    ignoreUrl?: boolean;
    success?: (data: unknown, status: number, type: string) => ActionSubjectType<State>;
    error?: (err: AjaxError) => ActionSubjectType<State>;
  };

  // options
  ignoreMiddleware?: boolean;
};

export type ActionSubjectType<State = any, Payload = any> =
  | ActionType<State, Payload>
  | Observable<ActionType<State, Payload>>
  | Promise<ActionType<State, Payload> | Observable<ActionType<State, Payload>>>;

export type ActionSubjectExtendType<State = any, Payload = any> =
  | ActionSubjectType<State, Payload>
  | ActionCallbackType<State, Payload>;

export type ActionCallbackType<State = any, Payload = any> = (
  getState: GetStateType<State>,
) => ActionSubjectType<State, Payload>;

export type ActionFunctionType<State, T extends any[]> = (...args: T) => ActionSubjectExtendType<State>;

export type ActionVoidType<T extends any[]> = (...args: T) => void;

//
// Store
//

export type GetStateType<State> = () => State;

export type StoreDispatchType<State = any, Payload = any> = (action: ActionSubjectExtendType<State, Payload>) => void;

export type StoreSubscribeType<State> = (state: State) => void;

export type StoreType<State, Payload = any> = {
  subscribe: (next: StoreSubscribeType<State>) => Subscription;
  dispatch: StoreDispatchType<State, Payload>;
  getState: GetStateType<State>;
};

export type StoreErrorHandlerType<State> = (err: any, dispatch: StoreDispatchType<State>, state: State) => void;

//
// Reducer
//

export type ReducersType<State, Action extends ActionType = any> = {
  [K in keyof State]: ReducerType<State[K], Action>;
};

export type ReducerType<State, Action extends ActionType = any> = (state: State | undefined, action: Action) => State;

//
// Middleware
//

export type MiddlewareType<State> = {
  init?: MiddlewareInitType<State>;
  action?: MiddlewareActionType<State>;
  error?: MiddlewareErrorType<State>;
};

export type MiddlewareInitType<State, Payload = any> = (
  state: State,
  dispatch: StoreDispatchType<State, Payload>,
  updateDirectly: StoreSubscribeType<State>,
) => void;

export type MiddlewareActionType<State, Payload = any> = (
  action: ActionType,
  state: State,
  dispatch: StoreDispatchType<State, Payload>,
  reducer: ReducerType<State>,
) => ActionSubjectType;

export type MiddlewareErrorType<State> = StoreErrorHandlerType<State>;

//
// Helper
//

export type TypeAction = string | symbol;

export type UnpackedArray<T> = T extends Array<infer U> ? U : T;
