import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ActionType, GetStateType, MiddlewareActionType, ReducerType, StoreDispatchType, StoreType } from '../types';
import * as storeUtils from './store';

export class MiddlewareUtils {
  manager<State>(middleware: Array<MiddlewareActionType<State>>, store: StoreType<State>, reducer: ReducerType<State>) {
    return (source$: Observable<ActionType<State>>) => {
      return source$.pipe(
        mergeMap((action) => {
          const action$ = of(action);

          if (action.ignoreMiddleware === true) {
            return action$;
          }

          return middleware.reduce(
            (prev$, mw) => this.handler(prev$, mw, store.getState, store.dispatch, reducer),
            action$,
          );
        }),
      );
    };
  }

  handler<State>(
    source$: Observable<ActionType<State>>,
    middleware: MiddlewareActionType<State>,
    getState: GetStateType<State>,
    dispatch: StoreDispatchType,
    reducer: ReducerType<State>,
  ) {
    return source$.pipe(
      map((action) => middleware(action, getState, dispatch, reducer)),
      // change inner streams to outer stream
      mergeMap(storeUtils.actionFlat),
      // validate the action
      tap(storeUtils.actionValidate),
    );
  }
}

export default new MiddlewareUtils();
