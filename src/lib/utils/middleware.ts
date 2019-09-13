import { Observable } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { map, mergeMap, tap } from 'rxjs/operators';

import * as storeUtils from './store';

import { actionType, middlewareActionType, reducerType, storeType, storeDispatchType } from '../types';

/**
 *
 */
export class MiddlewareUtils {
  /**
   *
   * @param middlewares
   * @param store
   * @param reducer
   */
  manager<State>(
    middlewares: Array<middlewareActionType<State>>,
    store: storeType<State>,
    reducer: reducerType<State>,
  ) {
    const state = store.getState();

    return (source$: Observable<actionType>) =>
      middlewares.reduce(
        (prev$, middleware) => this.handler(prev$, middleware, state, store.dispatch, reducer),
        source$,
      );
  }

  /**
   *
   * @param source$
   * @param middleware
   * @param store
   * @param reducer
   */
  handler<State>(
    source$: Observable<actionType>,
    middleware: middlewareActionType<State>,
    state: State,
    dispatch: storeDispatchType,
    reducer: reducerType<State>,
  ) {
    return source$.pipe(
      map((action) => middleware(action, state, dispatch, reducer)),
      // change inner streams to outer stream
      mergeMap(storeUtils.actionFlat),
      // validate the action
      tap(storeUtils.actionValidate),
    );
  }
}

/**
 *
 */
export default new MiddlewareUtils();
