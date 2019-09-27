import create from './lib/app';

export { middleware } from './lib/middleware';
export { combineReducers } from './lib/reducers';
export { getUniqueAction } from './lib/utils/helper';
export { actionFlat, actions, actionValidate } from './lib/utils/store';

export { createActionType, createReducerType, createStateType, dispatchType, UnpackedArray } from './lib/types';

/**
 *
 */
export default create;
