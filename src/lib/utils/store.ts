import { from, isObservable, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ActionSubjectType, ActionType, MiddlewareType, ReducerType, StoreErrorHandlerType, StoreType } from '../types';
import { defaultErrorHandler, getUniqueAction, isActionPayload, isActionType, isObject, isPromise } from './helper';

export const actionFlat = (action: ActionSubjectType): Observable<ActionType> => {
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
  const state = store.getState();

  // evaluates the error message
  errorHandlers.forEach((errorHandler) => {
    try {
      errorHandler(err, store.dispatch, state);
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
      return action.payload;

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
  fullUpdate: getUniqueAction('@@_rx_@@/ACTION_FULL_UPDATE'),
  ignoreAction: getUniqueAction('@@_rx_@@/ACTION_IGNORE'),
};
