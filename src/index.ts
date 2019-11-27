import app from './lib/app';

export { middleware } from './lib/middleware';
export { combineReducers } from './lib/reducers';
export { actionFlat, actions, actionValidate } from './lib/utils/store';
export { hocOptimize } from './lib/utils/React';
export { UnpackedArray, ActionReturnType, GetStateTypeFactory, ActionTypeFactory } from './lib/types';

export const createStore = app;
