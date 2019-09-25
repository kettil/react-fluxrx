jest.mock('./connect');
jest.mock('./store');

import createConnect from './connect';
import createStore from './store';

import { app } from './app';

/**
 *
 */
describe('Check the app function', () => {
  /**
   *
   */
  beforeEach(() => {
    (createConnect as jest.Mock).mockReturnValue({ returnCreateConnect: true });
    (createStore as jest.Mock).mockReturnValue({ returnCreateStore: true });
  });

  /**
   *
   */
  test('it should be return the app object when app() is called without init state', () => {
    const reducer = jest.fn().mockReturnValue({ returnReducer: true });

    const result = app(reducer);

    expect(result).toEqual({
      store: { returnCreateStore: true },
      connect: { returnCreateConnect: true },
      Provider: expect.any(Object),
      Consumer: expect.any(Object),
    });

    expect(result.Provider.$$typeof.toString()).toBe('Symbol(react.provider)');
    expect(result.Consumer.$$typeof.toString()).toBe('Symbol(react.context)');

    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith(undefined, { type: '', payload: undefined });

    expect(createStore).toHaveBeenCalledTimes(1);
    expect(createStore).toHaveBeenCalledWith(reducer, { returnReducer: true }, undefined, undefined);

    expect(createConnect).toHaveBeenCalledTimes(1);
    expect(typeof (createConnect as jest.Mock).mock.calls[0][0].$$typeof).toBe('symbol');
    expect((createConnect as jest.Mock).mock.calls[0][0].Consumer).toBe(result.Consumer);
    expect((createConnect as jest.Mock).mock.calls[0][0].Provider).toBe(result.Provider);
  });

  /**
   *
   */
  test('it should be return the app object when app() is called with init state', () => {
    const reducer = jest.fn().mockReturnValue({ returnReducer: true });

    const result = app(reducer, { initObject: true });

    expect(result).toEqual({
      store: { returnCreateStore: true },
      connect: { returnCreateConnect: true },
      Provider: expect.any(Object),
      Consumer: expect.any(Object),
    });

    expect(result.Provider.$$typeof.toString()).toBe('Symbol(react.provider)');
    expect(result.Consumer.$$typeof.toString()).toBe('Symbol(react.context)');

    expect(reducer).toHaveBeenCalledTimes(0);

    expect(createStore).toHaveBeenCalledTimes(1);
    expect(createStore).toHaveBeenCalledWith(reducer, { initObject: true }, undefined, undefined);

    expect(createConnect).toHaveBeenCalledTimes(1);
    expect(typeof (createConnect as jest.Mock).mock.calls[0][0].$$typeof).toBe('symbol');
    expect((createConnect as jest.Mock).mock.calls[0][0].Consumer).toBe(result.Consumer);
    expect((createConnect as jest.Mock).mock.calls[0][0].Provider).toBe(result.Provider);
  });
});
