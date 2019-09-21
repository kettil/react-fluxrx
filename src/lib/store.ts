import { BehaviorSubject, Observable, Subject } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { catchError, mergeMap, scan, tap } from 'rxjs/operators';

import { defaultErrorHandler } from './utils/helper';
import middlewareUtils from './utils/middleware';
import { actionError, actionFlat, actionValidate, reduceMiddlewares, reducerHandler } from './utils/store';

import { actionSubjectType, middlewareType, reducerType, storeType } from './types';

/**
 *
 * @param reducer
 * @param init
 * @param middlewares
 * @param errorHandler
 */
export const createStore = <State>(
  reducer: reducerType<State>,
  init: State,
  middlewares: Array<middlewareType<State>> = [],
) => {
  // create a stream for the action
  const action$ = new Subject<actionSubjectType>();

  // create a stream for the state
  const state$ = new BehaviorSubject(init);

  const subscribe: storeType<State>['subscribe'] = (callback) => state$.subscribe(callback);
  const dispatch: storeType<State>['dispatch'] = (action) => action$.next(action);
  const getState: storeType<State>['getState'] = () => state$.getValue();
  const updateDirectly = (state: State) => state$.next(state);

  // store callbacks
  const store: storeType<State> = { getState, dispatch, subscribe };

  const mwInit = reduceMiddlewares('init', middlewares);
  const mwAction = reduceMiddlewares('action', middlewares);
  const mwError = reduceMiddlewares('error', middlewares);

  mwInit.forEach((middleware) => middleware(getState(), dispatch, updateDirectly));
  if (mwError.length === 0) {
    mwError.push(defaultErrorHandler);
  }

  // manipulates the stream and adds it to the state
  action$
    .pipe(
      // change inner streams to outer stream
      mergeMap(actionFlat),
      // validate the action
      tap(actionValidate),
      // middleware
      middlewareUtils.manager(mwAction, store, reducer),
      // change action to state type
      scan(reducerHandler(reducer), init),
      // error handling
      catchError<State, Observable<State>>(actionError(mwError, store)),
    )
    .subscribe(state$);

  return store;
};

/**
 *
 */
export default createStore;
