import { from, isObservable, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { actionSubjectType, actionType, middlewareType, reducerType, storeErrorHandlerType, storeType } from '../types';
import { defaultErrorHandler, getUniqueAction, isActionPayload, isActionType, isObject, isPromise } from './helper';

export const actionFlat = (action: actionSubjectType): Observable<actionType> => {
  if (isObservable(action)) {
    return action;
  }

  if (isPromise(action)) {
    return from(action).pipe(mergeMap(actionFlat));
  }

  return of(action);
};

export const actionValidate = (action: any, withReturn = false): action is actionType => {
  if (isObject(action) && isActionType(action.type) && isActionPayload(action.payload)) {
    return true;
  }

  if (withReturn === true) {
    return false;
  }

  throw new Error(`Incorrect action structure (${JSON.stringify(action)})`);
};

export const actionError = <State>(errorHandlers: Array<storeErrorHandlerType<State>>, store: storeType<State>) => <T>(
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

export const reducerHandler = <State>(reducer: reducerType<State>): reducerType<State> => (
  state: State | undefined,
  action: actionType<State>,
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

export const reduceMiddleware = <State, K extends keyof middlewareType<State>>(
  type: K,
  middleware: Array<middlewareType<State>>,
) => {
  return middleware.map((mw) => mw[type]).filter((funcs) => typeof funcs === 'function') as Array<
    NonNullable<middlewareType<State>[K]>
  >;
};

export const actions = {
  fullUpdate: getUniqueAction('@@_rx_@@/ACTION_FULL_UPDATE'),
  ignoreAction: getUniqueAction('@@_rx_@@/ACTION_IGNORE'),
};
