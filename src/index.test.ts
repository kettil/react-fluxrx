import * as app from './index';
import createStore from './lib/app';
import { middleware } from './lib/middleware';
import { combineReducers } from './lib/reducers';
import { hocOptimize } from './lib/utils/React';
import { actionFlat, actions, actionValidate } from './lib/utils/store';

/**
 *
 */
describe('Check the index file', () => {
  /**
   *
   */
  test('Check the export object', () => {
    expect(app).toEqual({
      createStore,
      actions,
      actionFlat,
      actionValidate,
      combineReducers,
      hocOptimize,
      middleware,
    });
  });
});
