import app from './lib/app';

export { middleware } from './lib/middleware';
export { combineReducers } from './lib/reducers';
export { actionFlat, actions, actionValidate } from './lib/utils/store';
export { memo } from './lib/utils/React';
export { UnpackedArray, ActionReturnType, ActionType } from './lib/types';

export const createStore = app;
