import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { catchError } from 'rxjs/internal/operators/catchError';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { filter } from 'rxjs/internal/operators/filter';
import { scan } from 'rxjs/internal/operators/scan';

import {
  optionsStoreType,
  reducerType,
  storeType,
  actionType,
  actionSubjectType,
  subscribeType,
  middlewareActionType,
} from './libs/types';

/**
 * TypeScript Type Legende
 *
 * <S> = StateType
 * <P>  = PropsType
 * <MS> = MapStateType
 * <MD> = MapDispatchType
 *
 * @param reducer
 * @param init
 * @param middlewareAction
 * @param middlewareState
 */
export function createStore<S>(
  reducer: reducerType<S>,
  init: S,
  middlewares: middlewareActionType[] = [],
  options: optionsStoreType<S>,
): storeType<S> {
  // create a stream for the action
  const action$ = new Subject<actionSubjectType>();

  // create a stream for the state
  const state$ = new BehaviorSubject(init);

  // store callbacks
  const getState = () => state$.getValue();
  const dispatch = (action: actionSubjectType) => action$.next(action);
  const subscribe = (callback: subscribeType<S>) => state$.subscribe(callback);

  // manipulates the stream and adds it to the state
  action$
    .pipe(
      // change inner streams to outer stream
      mergeMap(options.actionFlat),
      // filter only action
      filter<actionType>(options.actionFilter),
      // middleware
      options.middlewareManager(dispatch, middlewares, options.actionFilter, options.middlewareHandler),
      // change action to state type
      scan(options.reducerHandler(reducer), init),
      // error handling
      catchError<any, actionType>(options.actionError(options.errorStoreHandler, dispatch)),
    )
    .subscribe(<any>state$);

  return { subscribe, dispatch, getState };
}
