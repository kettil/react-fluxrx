import { Observable } from 'rxjs/internal/Observable';
import { empty } from 'rxjs/internal/observable/empty';
import { of } from 'rxjs/internal/observable/of';
import { filter } from 'rxjs/internal/operators/filter';

import { actionType, actionSubjectType, errorHandlerType, dispatchType, logType } from './types';

//////////////////////
//
// STORE
//

/**
 *
 * @param action
 */
export function actionFilter(action: any): action is actionType {
  return (
    action !== undefined &&
    action !== null &&
    typeof action === 'object' &&
    typeof action.type === 'string' &&
    action.payload !== undefined
  );
}

/**
 *
 * @param action
 */
export function actionFlat(action: actionSubjectType) {
  return action instanceof Observable ? action : of(action);
}

/**
 *
 * @param errorHandler
 * @param dispatch
 */
export function actionError(errorHandler: errorHandlerType, dispatch: dispatchType) {
  return (error: Error): Observable<actionType> => {
    // evaluates the error message
    const result = errorHandler(error, dispatch);

    // it is a action object
    if (actionFilter(result)) {
      return of<actionType>(<actionType>result);
    }

    // it is a action observable
    if (result instanceof Observable) {
      return result.pipe(filter<actionType>(actionFilter));
    }

    // it is nothing
    return empty();
  };
}

/**
 *
 * @param error
 * @param dispatch
 */
export function errorStoreDefaultHandler(log: logType) {
  return (error: Error, dispatch: dispatchType): void => {
    log('Error: ' + error);
  };
}
