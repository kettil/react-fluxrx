import { devTools } from './devtools';

const subscribe = jest.fn();
const init = jest.fn();
const send = jest.fn();
const connect = jest.fn().mockReturnValue({ init, send, subscribe });
const redux = jest.fn();
const dispatch = jest.fn();
const reducer = jest.fn().mockImplementation((state, action) => ({ state, action }));
const updateDirectly = jest.fn();

/**
 *
 */
describe('Check the logger middleware', () => {
  /**
   *
   */
  beforeEach(() => {
    (redux as any).connect = connect;
    (global as any).__REDUX_DEVTOOLS_EXTENSION__ = redux;
  });

  /**
   *
   */
  test('it should be return the middleware object when devTools() is called and the devTools variable is defined', () => {
    const result = devTools();

    expect(result).toEqual({
      action: expect.any(Function),
      init: expect.any(Function),
    });

    expect(redux).toHaveBeenCalledTimes(0);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  /**
   *
   */
  test('it should be return the middleware object when devTools() is called and the devTools variable is undefined', () => {
    (global as any).__REDUX_DEVTOOLS_EXTENSION__ = undefined;

    const result = devTools();

    expect(result).toEqual({});
    expect(redux).toHaveBeenCalledTimes(0);
    expect(connect).toHaveBeenCalledTimes(0);
  });

  /**
   *
   */
  test('it should be output of the message when the middleware.init() is called', () => {
    const result = devTools();

    expect(result).toEqual({
      action: expect.any(Function),
      init: expect.any(Function),
    });

    const callback = result.init as (...args: any[]) => void;

    expect(callback.length).toBe(3);

    callback({ isState: true }, dispatch, updateDirectly);

    expect(redux).toHaveBeenCalledTimes(0);
    expect(connect).toHaveBeenCalledTimes(1);

    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledWith({ isState: true });
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
    expect(send).toHaveBeenCalledTimes(0);

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(updateDirectly).toHaveBeenCalledTimes(0);
  });

  const testDataInit: Array<[string, string, any, number, number]> = [
    [
      'updateDirectly()',
      'JUMP_TO_ACTION',
      { type: 'DISPATCH', state: JSON.stringify({ isDevTool: true }), payload: { type: 'JUMP_TO_ACTION' } },
      0,
      1,
    ],
    [
      'updateDirectly()',
      'JUMP_TO_STATE',
      { type: 'DISPATCH', state: JSON.stringify({ isDevTool: true }), payload: { type: 'JUMP_TO_STATE' } },
      0,
      1,
    ],
    [
      'updateDirectly()',
      'UNKNOWN',
      { type: 'DISPATCH', state: JSON.stringify({ isDevTool: true }), payload: { type: 'UNKNOWN' } },
      0,
      0,
    ],

    ['dispatch()', 'ACTION', { type: 'ACTION', payload: JSON.stringify({ isPayload: true }) }, 1, 0],
    ['nothing', 'UNKNOWN', { type: 'ACTION' }, 0, 0],
  ];

  /**
   *
   */
  test.each(testDataInit)(
    'it should be %s is called when callback() from middleware.init() is called with type "%s"',
    (_1, _2, message, countDispatch, countUpdateDirectly) => {
      const result = devTools();

      expect(result).toEqual({
        action: expect.any(Function),
        init: expect.any(Function),
      });

      const callbackInit = result.init as (...args: any[]) => void;

      expect(callbackInit.length).toBe(3);

      callbackInit({ isState: true }, dispatch, updateDirectly);

      expect(redux).toHaveBeenCalledTimes(0);
      expect(connect).toHaveBeenCalledTimes(1);

      expect(init).toHaveBeenCalledTimes(1);
      expect(init).toHaveBeenCalledWith({ isState: true });
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(send).toHaveBeenCalledTimes(0);

      const callback = subscribe.mock.calls[0][0];

      callback(message);

      expect(dispatch).toHaveBeenCalledTimes(countDispatch);
      if (countDispatch > 0) {
        expect(dispatch).toHaveBeenCalledWith({ isPayload: true });
      }

      expect(updateDirectly).toHaveBeenCalledTimes(countUpdateDirectly);
      if (countUpdateDirectly > 0) {
        expect(updateDirectly).toHaveBeenCalledWith({ isDevTool: true });
      }
    },
  );

  /**
   *
   */
  test('it should be send() is called when the middleware.action() is called', () => {
    const result = devTools();

    expect(result).toEqual({
      action: expect.any(Function),
      init: expect.any(Function),
    });

    (result.init as (...args: any[]) => void)({ iniState: true });
    const callback = result.action as (...args: any[]) => void;

    expect(callback.length).toBe(4);

    callback({ type: 'add', payload: { message: '...' } }, { isState: true }, dispatch, reducer);

    expect(redux).toHaveBeenCalledTimes(0);
    expect(connect).toHaveBeenCalledTimes(1);

    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledWith({ iniState: true });
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      { payload: { message: '...' }, type: 'add' },
      { action: { payload: { message: '...' }, type: 'add' }, state: { iniState: true } },
    );

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith({ iniState: true }, { payload: { message: '...' }, type: 'add' });
  });
});
