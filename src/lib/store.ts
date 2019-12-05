import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, mergeMap, scan, tap } from 'rxjs/operators';
import { ActionSubjectExtendType, MiddlewareType, ReducerType, StoreType } from './types';
import { defaultErrorHandler } from './utils/helper';
import middlewareUtils from './utils/middleware';
import {
  actionCallback,
  actionError,
  actionFlat,
  actionValidate,
  reduceMiddleware,
  reducerHandler,
} from './utils/store';

export const createStore = <State>(
  reducer: ReducerType<State>,
  init: State,
  middleware: Array<MiddlewareType<State>> = [],
  timeDebounce: number = 0,
) => {
  // create a stream for the action
  const action$ = new Subject<ActionSubjectExtendType<State>>();

  // create a stream for the state
  const state$ = new BehaviorSubject(init);
  const pipe$ = timeDebounce > 0 ? state$.pipe(debounceTime(timeDebounce)) : state$;

  const subscribe: StoreType<State>['subscribe'] = (callback) => pipe$.subscribe(callback);
  const dispatch: StoreType<State>['dispatch'] = (action) => action$.next(action);
  const getState: StoreType<State>['getState'] = () => state$.getValue();
  const updateDirectly = (state: State) => state$.next(state);

  // store callbacks
  const store: StoreType<State> = { getState, dispatch, subscribe };

  const mwInits = reduceMiddleware('init', middleware);
  const mwActions = reduceMiddleware('action', middleware);
  const mwErrors = reduceMiddleware('error', middleware);

  mwInits.forEach((mwInit) => mwInit(getState, dispatch, updateDirectly));
  if (mwErrors.length === 0) {
    mwErrors.push(defaultErrorHandler);
  }

  const handlerReducer = reducerHandler(reducer);
  const handlerError = actionError(mwErrors, store);

  // manipulates the stream and adds it to the state
  action$
    .pipe(
      // calls the callback from the action and integrates the return value
      mergeMap(actionCallback(getState)),
      // change inner streams to outer stream
      mergeMap(actionFlat),
      // validate the action
      tap(actionValidate),
      // middleware
      middlewareUtils.manager(mwActions, store, handlerReducer),
      // error handling
      catchError(handlerError),
      // change action to state type
      scan(handlerReducer, init),
      // only emit when the current state is different than the last
      distinctUntilChanged(),
      // error handling
      catchError<State, Observable<State>>(handlerError),
    )
    .subscribe(state$);

  return store;
};

export default createStore;
