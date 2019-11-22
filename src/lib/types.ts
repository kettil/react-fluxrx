import { Observable, Subscription } from 'rxjs';
import { AjaxRequest } from 'rxjs/ajax';

//
// User Types
//

export type DispatchType = StoreDispatchType;

export type ActionReturnType<T extends Record<string, any>> = {
  [K in keyof T]: ActionFilter<ActionRules<ReturnType<T[K]>>>;
}[keyof T];

type ActionRulePromise<Value, Other> = Value extends Promise<infer P> ? ActionRuleObservable<P, P> : Other;
type ActionRuleFunction<Value, Other> = Value extends () => void ? never : Other;
type ActionRuleObservable<Value, Other> = Value extends Observable<infer O> ? O : Other;
type ActionRules<Value> = ActionRulePromise<Value, ActionRuleObservable<Value, ActionRuleFunction<Value, Value>>>;
type ActionFilter<Value> = Value extends { type: string } ? Value : never;

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
    response?: (data: unknown, status: number, type: string) => ActionSubjectType;
  };

  // options
  ignoreMiddleware?: boolean;
};

export type ActionSubjectType<State = any, Payload = any> =
  | ActionType<State, Payload>
  | Observable<ActionType<State, Payload>>
  | Promise<ActionType<State, Payload> | Observable<ActionType<State, Payload>>>;

//
// Connect
//

export type MapStateToPropsType<State, Props, MapState> = (state: State, ownProps: Props) => MapState;

export type MapDispatchToPropsType<Props, MapDispatch> = (dispatch: StoreDispatchType, ownProps: Props) => MapDispatch;

//
// Store
//

export type StoreDispatchType<State = any, Payload = any> = (action: ActionSubjectType<State, Payload>) => void;

export type StoreSubscribeType<State> = (state: State) => void;

export type StoreType<State, Payload = any> = {
  subscribe: (next: StoreSubscribeType<State>) => Subscription;
  dispatch: StoreDispatchType<State, Payload>;
  getState: () => State;
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

export type ExtractProps<T> = T extends new (props: infer U1) => any
  ? U1
  : T extends (props: infer U2) => any
  ? U2
  : {};

export type UnpackedArray<T> = T extends Array<infer U> ? U : T;
