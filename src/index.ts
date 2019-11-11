import create from './lib/app';

export { middleware } from './lib/middleware';
export { combineReducers } from './lib/reducers';
export { getUniqueAction } from './lib/utils/helper';
export { actionFlat, actions, actionValidate } from './lib/utils/store';
export { bindActions } from './lib/utils/connect';

export { dispatchType, UnpackedArray, ActionReturnType } from './lib/types';

/**
 *
 */
export default create;
