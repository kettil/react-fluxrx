import { from, isObservable, Observable, of } from 'rxjs';

import { defaultErrorHandler, getUniqueAction, isObject, isPromise } from './helper';

import { actionSubjectType, actionType, middlewareType, reducerType, storeErrorHandlerType, storeType } from '../types';

/**
 *
 * @param action
 */
export const actionFlat = (action: actionSubjectType): Observable<actionType<any>> => {
  if (isObservable(action)) {
    return action;
  }

  if (isPromise(action)) {
    return from(action);
  }

  return Array.isArray(action) ? of(...action) : of(action);
};

/**
 *
 * @param action
 */
export const actionValidate = (action: actionType) => {
  const types = ['string', 'symbol'];

  if (!isObject(action) || types.indexOf(typeof action.type) === -1 || typeof action.payload === 'undefined') {
    throw new Error(`Incorrect action structure (${JSON.stringify(action)})`);
  }
};

/**
 *
 * @param errorHandler
 * @param store
 */
export const actionError = <State>(errorHandlers: Array<storeErrorHandlerType<State>>, store: storeType<State>) => {
  return (err: any, action$: Observable<State>) => {
    const state = store.getState();

    // evaluates the error message
    errorHandlers.forEach((errorHandler) => {
      try {
        errorHandler(err, store.dispatch, state);
      } catch (err) {
        defaultErrorHandler(err);
      }
    });

    // it is nothing
    return action$;
  };
};

/**
 *
 * @param reducer
 */
export const reducerHandler = <State>(reducer: reducerType<State>): reducerType<State> => (
  state: State | undefined,
  action: actionType,
): State => {
  if (action.type === actions.fullUpdate) {
    return action.payload;
  }

  return reducer(state, action);
};

/**
 *
 * @param middlewares
 */
export const reduceMiddlewares = <State, K extends keyof middlewareType<State>>(
  type: K,
  middlewares: Array<middlewareType<State>>,
) => {
  return middlewares.map((middleware) => middleware[type]).filter((funcs) => typeof funcs === 'function') as Array<
    NonNullable<middlewareType<State>[K]>
  >;
};

/**
 *
 */
export const actions = {
  fullUpdate: getUniqueAction('FULL_UPDATE_ACTION'),
};
