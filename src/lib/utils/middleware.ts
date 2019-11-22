import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ActionType, MiddlewareActionType, ReducerType, StoreDispatchType, StoreType } from '../types';
import * as storeUtils from './store';

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
  manager<State>(middleware: Array<MiddlewareActionType<State>>, store: StoreType<State>, reducer: ReducerType<State>) {
    return (source$: Observable<ActionType<State>>) => {
      return source$.pipe(
        mergeMap((action) => {
          const action$ = of(action);

          if (action.ignoreMiddleware === true) {
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
    source$: Observable<ActionType<State>>,
    middleware: MiddlewareActionType<State>,
    state: State,
    dispatch: StoreDispatchType,
    reducer: ReducerType<State>,
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
