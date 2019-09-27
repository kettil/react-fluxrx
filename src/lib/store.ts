import { BehaviorSubject, Observable, Subject } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { catchError, debounceTime, mergeMap, scan, tap } from 'rxjs/operators';

import { defaultErrorHandler } from './utils/helper';
import middlewareUtils from './utils/middleware';
import { actionError, actionFlat, actionValidate, reduceMiddleware, reducerHandler } from './utils/store';

import { actionSubjectType, middlewareType, reducerType, storeType } from './types';

/**
 *
 * @param reducer
 * @param init
 * @param middleware
 * @param errorHandler
 */
export const createStore = <State>(
  reducer: reducerType<State>,
  init: State,
  middleware: Array<middlewareType<State>> = [],
  timeDebounce: number = 0,
) => {
  // create a stream for the action
  const action$ = new Subject<actionSubjectType>();

  // create a stream for the state
  const state$ = new BehaviorSubject(init);
  const pipe$ = timeDebounce > 0 ? state$.pipe(debounceTime(timeDebounce)) : state$;

  const subscribe: storeType<State>['subscribe'] = (callback) => pipe$.subscribe(callback);
  const dispatch: storeType<State>['dispatch'] = (action) => action$.next(action);
  const getState: storeType<State>['getState'] = () => state$.getValue();
  const updateDirectly = (state: State) => state$.next(state);

  // store callbacks
  const store: storeType<State> = { getState, dispatch, subscribe };

  const mwInits = reduceMiddleware('init', middleware);
  const mwActions = reduceMiddleware('action', middleware);
  const mwErrors = reduceMiddleware('error', middleware);

  mwInits.forEach((mwInit) => mwInit(getState(), dispatch, updateDirectly));
  if (mwErrors.length === 0) {
    mwErrors.push(defaultErrorHandler);
  }

  const handlerReducer = reducerHandler(reducer);

  // manipulates the stream and adds it to the state
  action$
    .pipe(
      // change inner streams to outer stream
      mergeMap(actionFlat),
      // validate the action
      tap(actionValidate),
      // middleware
      middlewareUtils.manager(mwActions, store, handlerReducer),
      // change action to state type
      scan(handlerReducer, init),
      // error handling
      catchError<State, Observable<State>>(actionError(mwErrors, store)),
    )
    .subscribe(state$);

  return store;
};

/**
 *
 */
export default createStore;
