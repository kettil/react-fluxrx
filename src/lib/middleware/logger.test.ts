/* tslint:disable:no-console */
jest.spyOn(console, 'log').mockImplementation();
jest.spyOn(console, 'info').mockImplementation();
jest.spyOn(console, 'error').mockImplementation();
jest.spyOn(console, 'groupCollapsed').mockImplementation();
jest.spyOn(console, 'groupEnd').mockImplementation();

import { logger } from './logger';

describe('Check the logger middleware', () => {
  test('it should be return the middleware object when logger() is called', () => {
    const result = logger();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });
  });

  test('it should be output of the message when the middleware.init() is called', () => {
    const getState = jest.fn(() => ({ isState: true }));
    const result = logger();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    const callback = result.init as (...args: any[]) => void;

    expect(callback.length).toBe(3);

    callback(getState);

    expect(getState).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('init', { state: { isState: true } });
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('it should be output of the message when the middleware.action() is called with console.groupCollapsed', () => {
    const getState = jest.fn(() => ({ isState: true }));
    const reducer = jest.fn().mockReturnValue({ newState: true });
    const result = logger();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    expect(result.action!.length).toBe(4);

    result.action!({ type: 'edit', payload: { id: 3, message: '...' } }, getState, () => undefined, reducer);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith({ isState: true }, { payload: { id: 3, message: '...' }, type: 'edit' });

    expect(console.info).toHaveBeenCalledTimes(3);
    expect(console.info).toHaveBeenNthCalledWith(1, '%c prev state', expect.any(String), { isState: true });
    expect(console.info).toHaveBeenNthCalledWith(2, '%c action    ', expect.any(String), { id: 3, message: '...' }, {});
    expect(console.info).toHaveBeenNthCalledWith(3, '%c next state', expect.any(String), { newState: true });
    expect(console.groupCollapsed).toHaveBeenCalledTimes(1);
    expect(console.groupCollapsed).toHaveBeenCalledWith('%c Action: %c edit', expect.any(String), expect.any(String));
    expect(console.groupEnd).toHaveBeenCalledTimes(1);
  });

  test('it should be output of the message when the middleware.action() is called without console.groupCollapsed', () => {
    const getState = jest.fn(() => ({ isState: true }));
    const reducer = jest.fn().mockReturnValue({ newState: true });
    const type = 'TYPE_KEY';
    const result = logger(false);

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    expect(result.action!.length).toBe(4);

    result.action!({ type, payload: { id: 3, message: '...' } }, getState, () => undefined, reducer);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith({ isState: true }, { payload: { id: 3, message: '...' }, type });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('action', 'TYPE_KEY', {
      action: { payload: { id: 3, message: '...' }, type },
      nextState: { newState: true },
      prevState: { isState: true },
    });
  });

  test('it should be output of the error message when the middleware.error() is called with error instance', () => {
    const getState = jest.fn(() => ({ state: true }));
    const result = logger<any>();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    expect(result.error!.length).toBe(3);

    result.error!(new Error('error logger'), () => undefined, getState);

    expect(getState).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledTimes(3);
    expect(console.info).toHaveBeenNthCalledWith(1, '%c state  ', 'color: #9E9E9E; font-weight: bold', { state: true });
    expect(console.info).toHaveBeenNthCalledWith(2, '%c message', 'color: #F20404; font-weight: bold', 'error logger');
    expect(console.info).toHaveBeenNthCalledWith(3, '%c stack  ', expect.any(String), expect.any(String));
    expect(console.groupCollapsed).toHaveBeenCalledTimes(1);
    expect(console.groupCollapsed).toHaveBeenCalledWith(
      '%c Error:  %c error logger',
      expect.any(String),
      expect.any(String),
    );
    expect(console.groupEnd).toHaveBeenCalledTimes(1);
  });

  test('it should be output of the error message when the middleware.error() is called with string', () => {
    const getState = jest.fn(() => ({ state: true }));
    const result = logger<any>();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    expect(result.error!.length).toBe(3);

    result.error!('error logger', () => undefined, getState);

    expect(getState).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('error logger');
  });

  test('it should be output of the error message when the middleware.error() is called and error within the function', () => {
    const getState = jest.fn(() => ({ state: true }));
    (console.groupCollapsed as jest.Mock).mockImplementationOnce(() => {
      throw new Error('...');
    });

    const result = logger<any>();

    expect(result).toEqual({
      action: expect.any(Function),
      error: expect.any(Function),
      init: expect.any(Function),
    });

    expect(result.error!.length).toBe(3);

    result.error!(new Error('error logger'), () => undefined, getState);

    expect(getState).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(expect.any(Error));
  });
});
