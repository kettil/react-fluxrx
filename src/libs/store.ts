import { Observable, of } from 'rxjs';

import { actionSubjectType, actionType, dispatchType, errorHandlerType, logType } from './types';

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
  return (error: any, action$: Observable<actionType>): Observable<actionType> => {
    // evaluates the error message
    errorHandler(error, dispatch);

    // it is nothing
    return action$;
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
