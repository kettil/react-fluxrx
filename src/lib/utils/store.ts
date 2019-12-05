import { from, isObservable, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  ActionSubjectExtendType,
  ActionSubjectType,
  ActionType,
  GetStateType,
  MiddlewareType,
  ReducerType,
  StoreErrorHandlerType,
  StoreType,
} from '../types';
import { defaultErrorHandler, isActionPayload, isActionType, isObject, isPromise } from './helper';

export const actionCallback = <State>(getState: GetStateType<State>) => (
  action: ActionSubjectExtendType<State>,
): Observable<ActionSubjectType<State>> => {
  if (!isObservable(action) && !isPromise(action) && typeof action === 'function') {
    return actionFlat(action(getState));
  }

  return of(action);
};

export const actionFlat = <State>(action: ActionSubjectType<State>): Observable<ActionType<State>> => {
  if (isObservable(action)) {
    return action;
  }

  if (isPromise(action)) {
    return from(action).pipe(mergeMap(actionFlat));
  }

  return of(action);
};

export const actionValidate = (action: any, withReturn = false): action is ActionType => {
  if (isObject(action) && isActionType(action.type) && isActionPayload(action.payload)) {
    return true;
  }

  if (withReturn === true) {
    return false;
  }

  throw new Error(`Incorrect action structure (${JSON.stringify(action)})`);
};

export const actionError = <State>(errorHandlers: Array<StoreErrorHandlerType<State>>, store: StoreType<State>) => <T>(
  err: any,
  rx$: Observable<T>,
): Observable<T> => {
  // evaluates the error message
  errorHandlers.forEach((errorHandler) => {
    try {
      errorHandler(err, store.dispatch, store.getState);
    } catch (err) {
      defaultErrorHandler(err);
    }
  });

  return rx$;
};

export const reducerHandler = <State>(reducer: ReducerType<State>): ReducerType<State> => (
  state: State | undefined,
  action: ActionType<State>,
): State => {
  switch (true) {
    case action.type === actions.ignoreAction:
      return state!;

    case action.type === actions.fullUpdate:
      // This is a special case where the complete state should be overwritten.
      return action.payload as any;

    default:
      return reducer(state, action);
  }
};

export const reduceMiddleware = <State, K extends keyof MiddlewareType<State>>(
  type: K,
  middleware: Array<MiddlewareType<State>>,
) => {
  return middleware.map((mw) => mw[type]).filter((funcs) => typeof funcs === 'function') as Array<
    NonNullable<MiddlewareType<State>[K]>
  >;
};

export const actions = {
  fullUpdate: '@@RX@@/ACTION_FULL_UPDATE',
  ignoreAction: '@@RX@@/ACTION_IGNORE',
} as const;
