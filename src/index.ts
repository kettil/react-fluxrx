import create from './lib/app';

export { middleware } from './lib/middleware';
export { combineReducers } from './lib/reducers';
export { getUniqueAction } from './lib/utils/helper';
export { actions } from './lib/utils/store';

export { createActionType, createReducerType, createStateType, dispatchType, UnpackedArray } from './lib/types';

/**
 *
 */
export default create;
