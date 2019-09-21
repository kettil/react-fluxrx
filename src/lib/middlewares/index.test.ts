import devTools from './devTools';
import logger from './logger';

import middlewares from './index';

/**
 *
 */
describe('Check the middlewares index', () => {
  /**
   *
   */
  test('it should be that the index returns an object with all middlewares', () => {
    expect(middlewares).toEqual({
      devTools,
      logger,
    });
  });
});
