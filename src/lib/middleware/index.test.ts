import ajax from './ajax';
import devTools from './devTools';
import middleware from './index';
import logger from './logger';

describe('Check the middleware index', () => {
  test('it should be that the index returns an object with all middleware', () => {
    expect(middleware).toEqual({
      ajax,
      devTools,
      logger,
    });
  });
});
