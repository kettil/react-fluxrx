import { Observable } from 'rxjs/internal/Observable';
import { Subscriber } from 'rxjs/internal/Subscriber';

import {
  middlewareActionType,
  dispatchType,
  actionType,
  actionValidatorType,
  middlewareHandlerType,
} from './types';

/**
 *
 * @param dispatch
 * @param middlewares
 * @param actionValidator
 */
export function middlewareManager(
  dispatch: dispatchType,
  middlewares: middlewareActionType[],
  actionValidator: actionValidatorType,
  middlewareHandler: middlewareHandlerType,
) {
  return (source$: Observable<actionType>) =>
    middlewares.reduce(
      (prev$: Observable<actionType>, middleware: middlewareActionType): Observable<actionType> => {
        return middlewareHandler(dispatch, middleware, actionValidator, prev$);
      },
      source$,
    );
}

/**
 *
 * @param dispatch
 * @param middleware
 * @param actionValidator
 * @param source$
 */
export function middlewareHandler(
  dispatch: dispatchType,
  middleware: middlewareActionType,
  actionValidator: actionValidatorType,
  source$: Observable<actionType>,
): Observable<actionType> {
  return new Observable((subscriber$: Subscriber<actionType>) => {
    const complete = () => subscriber$.complete();
    const error = (err: any) => subscriber$.error(err);
    const next = (action: actionType) => {
      const result = middleware(action, dispatch);
      const name = middleware.name;

      if (result instanceof Observable) {
        // result is a observable
        return result.subscribe(
          (action: actionType) => {
            if (!actionValidator(action)) {
              throw new Error('The middleware "' + name + '" does not return a valid action');
            }
            subscriber$.next(action);
          },
          error,
          complete,
        );
      }

      if (!actionValidator(result)) {
        throw new Error('The middleware "' + name + '" does not return a valid action');
      }
      // result is a action object
      return subscriber$.next(result);
    };

    return source$.subscribe(next, error, complete);
  });
}
