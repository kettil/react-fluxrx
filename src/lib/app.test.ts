jest.mock('./store');

import { app } from './app';
import createStore from './store';

describe('Check the app function', () => {
  beforeEach(() => {
    (createStore as jest.Mock).mockReturnValue({ returnStore: true });
  });

  test('it should be return the app object when app() is called without init state', () => {
    const reducer = jest.fn().mockReturnValue({ returnReducer: true });

    const result = app(reducer);

    expect(result).toEqual({
      store: { returnStore: true },
      useStore: expect.any(Function),
      useSelector: expect.any(Function),
      useDispatch: expect.any(Function),
      useDispatchRx: expect.any(Function),
      Consumer: expect.any(Object),
      Provider: expect.any(Object),
    });

    expect(result.Consumer.$$typeof.toString()).toBe('Symbol(react.context)');
    expect(result.Provider.$$typeof.toString()).toBe('Symbol(react.provider)');

    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith(undefined, { type: '', payload: undefined });

    expect(createStore).toHaveBeenCalledTimes(1);
    expect(createStore).toHaveBeenCalledWith(reducer, { returnReducer: true }, undefined, undefined);
  });

  test('it should be return the app object when app() is called with init state', () => {
    const reducer = jest.fn().mockReturnValue({ returnReducer: true });

    const result = app(reducer, { initObject: true });

    expect(result).toEqual({
      store: { returnStore: true },
      useStore: expect.any(Function),
      useSelector: expect.any(Function),
      useDispatch: expect.any(Function),
      useDispatchRx: expect.any(Function),
      Consumer: expect.any(Object),
      Provider: expect.any(Object),
    });

    expect(result.Consumer.$$typeof.toString()).toBe('Symbol(react.context)');
    expect(result.Provider.$$typeof.toString()).toBe('Symbol(react.provider)');

    expect(reducer).toHaveBeenCalledTimes(0);

    expect(createStore).toHaveBeenCalledTimes(1);
    expect(createStore).toHaveBeenCalledWith(reducer, { initObject: true }, undefined, undefined);
  });
});
