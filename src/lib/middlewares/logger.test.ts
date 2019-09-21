/* tslint:disable:no-console */
jest.spyOn(console, 'log').mockImplementation();
jest.spyOn(console, 'error').mockImplementation();

import { logger } from './logger';

/**
 *
 */
describe('Check the logger middleware', () => {
  /**
   *
   */
  test('it should be return the middleware object when logger() is called', () => {
    const result = logger();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });
  });

  /**
   *
   */
  test('it should be output of the message when the middleware.init() is called', () => {
    const result = logger();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    const callback = result.init as (...args: any[]) => void;

    expect(callback.length).toBe(3);

    callback({ isState: true });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('init', { state: { isState: true } });
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  /**
   *
   */
  test('it should be output of the message when the middleware.action() is called', () => {
    const dispatch = jest.fn();
    const reducer = jest.fn().mockReturnValue({ newState: true });

    const result = logger();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    const callback = result.action as (...args: any[]) => void;

    expect(callback.length).toBe(4);

    callback({ type: 'edit', payload: { id: 3, message: '...' } }, { isState: true }, dispatch, reducer);

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith({ isState: true }, { payload: { id: 3, message: '...' }, type: 'edit' });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('action', {
      action: { payload: { id: 3, message: '...' }, type: 'edit' },
      nextState: { newState: true },
      prevState: { isState: true },
    });
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  /**
   *
   */
  test('it should be output of the error message when the middleware.error() is called', () => {
    const result = logger();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    const callback = result.error as (...args: any[]) => void;

    expect(callback.length).toBe(3);

    callback(new Error('error logger'));

    expect(console.log).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });
});
