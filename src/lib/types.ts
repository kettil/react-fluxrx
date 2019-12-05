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

export type ActionType<State = any> = {
  readonly type: string;
  readonly payload: TypePayload;

  // socket.io
  ws?:
    | boolean
    | {
        // overwrite the type in the websocket context
        readonly type?: string;
        // overwrite the payload in the websocket context
        readonly payload?: TypePayload;
      };

  // ajax
  ajax?: {
    readonly path: string;
    readonly method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    readonly data?: TypePayload;
    readonly options?: AjaxRequest;
    readonly silent?: boolean;
    readonly ignoreUrl?: boolean;
    readonly success?: (data: unknown, status: number, type: string) => ActionSubjectType<State>;
    readonly error?: (err: AjaxError) => ActionSubjectType<State>;
  };

  // options
  readonly ignoreMiddleware?: boolean;
};

export type ActionSubjectType<State = any> =
  | ActionType<State>
  | Observable<ActionType<State>>
  | Promise<ActionType<State> | Observable<ActionType<State>>>;

export type ActionSubjectExtendType<State = any> = ActionSubjectType<State> | ActionCallbackType<State>;

export type ActionCallbackType<State = any> = (getState: GetStateType<State>) => ActionSubjectType<State>;

export type ActionFunctionType<State, T extends any[]> = (...args: T) => ActionSubjectExtendType<State>;

export type ActionVoidType<T extends any[]> = (...args: T) => void;

//
// Store
//

export type GetStateType<State> = () => State;

export type StoreDispatchType<State = any> = (action: ActionSubjectExtendType<State>) => void;

export type StoreSubscribeType<State> = (state: State) => void;

export type StoreType<State> = {
  readonly subscribe: (next: StoreSubscribeType<State>) => Subscription;
  readonly dispatch: StoreDispatchType<State>;
  readonly getState: GetStateType<State>;
};

export type StoreErrorHandlerType<State> = (
  err: any,
  dispatch: StoreDispatchType<State>,
  getState: GetStateType<State>,
) => void;

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
  readonly init?: MiddlewareInitType<State>;
  readonly action?: MiddlewareActionType<State>;
  readonly error?: MiddlewareErrorType<State>;
};

export type MiddlewareInitType<State> = (
  getState: GetStateType<State>,
  dispatch: StoreDispatchType<State>,
  updateDirectly: StoreSubscribeType<State>,
) => void;

export type MiddlewareActionType<State> = (
  action: ActionType,
  getState: GetStateType<State>,
  dispatch: StoreDispatchType<State>,
  reducer: ReducerType<State>,
) => ActionSubjectType;

export type MiddlewareErrorType<State> = StoreErrorHandlerType<State>;

//
// Helper
//

export type TypePayload = Record<string, any>;

export type UnpackedArray<T> = T extends Array<infer U> ? U : T;
