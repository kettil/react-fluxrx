import { Observable, of } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { map, mergeMap, tap } from 'rxjs/operators';

import * as storeUtils from './store';

import { actionType, middlewareActionType, reducerType, storeDispatchType, storeType } from '../types';

/**
 *
 */
export class MiddlewareUtils {
  /**
   *
   * @param middleware
   * @param store
   * @param reducer
   */
  manager<State>(middleware: Array<middlewareActionType<State>>, store: storeType<State>, reducer: reducerType<State>) {
    return (source$: Observable<actionType>) => {
      return source$.pipe(
        mergeMap((action) => {
          const action$ = of(action);

          if (action.withoutMiddleware === true) {
            return action$;
          }

          const state = store.getState();

          return middleware.reduce((prev$, mw) => this.handler(prev$, mw, state, store.dispatch, reducer), action$);
        }),
      );
    };
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
