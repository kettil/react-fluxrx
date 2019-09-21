import create from './lib/app';

export { getUniqueAction } from './lib/utils/helper';
export { actions } from './lib/utils/store';
export { combineReducers } from './lib/reducers';
export { middlewares } from './lib/middlewares';
export * from './lib/types';

/**
 *
 */
export default create;
