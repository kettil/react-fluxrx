import create from './lib/app';

import { middleware } from './lib/middleware';
import { combineReducers } from './lib/reducers';
import { getUniqueAction } from './lib/utils/helper';
import { actionFlat, actions, actionValidate } from './lib/utils/store';

import createApp, * as app from './index';

/**
 *
 */
describe('Check the index file', () => {
  /**
   *
   */
  test('Check the export object', () => {
    expect(createApp).toBe(create);

    expect(app).toEqual({
      default: create,
      getUniqueAction,
      actions,
      actionFlat,
      actionValidate,
      combineReducers,
      middleware,
    });
  });
});
