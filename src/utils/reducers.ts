import { actionType } from './types';

//////////////////////
//
// REDUCERS
//

/**
 *
 * @param key
 * @param action
 */
export function errorNewStateIsUndefined(key: string, action: actionType): string {
  const type = action && action.type;

  return 'Action ' + type + ' from Reducer ' + key + ' returns an undefined value.';
}

/**
 *
 * @param key
 */
export function errorReducerIsNotInitialized(key: string): string {
  return 'Reducer "' + key + '" did not return an initialized state.';
}

/**
 *
 * @param key
 */
export function errorReducerIsNotAFunction(key: string) {
  return 'No reducer function provided for key "' + key + '".';
}
