import { checkedReducers, combineReducers } from './reducers';

/**
 *
 */
describe('Check the reducers function', () => {
  /**
   *
   */
  test('it should be return the new state when combineReducers() is called', () => {
    const reducer1 = jest.fn().mockReturnValue({ a: 42 });
    const reducer2 = jest.fn().mockReturnValue({ a: 13 });

    const callback = combineReducers({ a: reducer1, b: reducer2 });

    expect(callback).toBeInstanceOf(Function);
    expect(callback.length).toBe(2);

    expect(reducer1).toHaveBeenCalledTimes(1);
    expect(reducer1).toHaveBeenCalledWith(undefined, { payload: '', type: '' });
    expect(reducer2).toHaveBeenCalledTimes(1);
    expect(reducer2).toHaveBeenCalledWith(undefined, { payload: '', type: '' });

    reducer1.mockReset();
    reducer2.mockReset();

    reducer1.mockReturnValue({ a: 42 });
    reducer2.mockReturnValue({ a: 13 });

    const result = callback({ a: { a: 3 }, b: { a: 7 } }, { type: 'updateX', payload: 17 });

    expect(result).toEqual({ a: { a: 42 }, b: { a: 13 } });

    expect(reducer1).toHaveBeenCalledTimes(1);
    expect(reducer1).toHaveBeenCalledWith({ a: 3 }, { payload: 17, type: 'updateX' });
    expect(reducer2).toHaveBeenCalledTimes(1);
    expect(reducer2).toHaveBeenCalledWith({ a: 7 }, { payload: 17, type: 'updateX' });
  });

  /**
   *
   */
  test('it should be return the old state when combineReducers() is called', () => {
    const reducer1 = jest.fn().mockReturnValue({ a: 42 });
    const reducer2 = jest.fn().mockReturnValue({ a: 13 });

    const callback = combineReducers({ a: reducer1, b: reducer2 });

    expect(callback).toBeInstanceOf(Function);
    expect(callback.length).toBe(2);

    reducer1.mockReset();
    reducer2.mockReset();

    reducer1.mockImplementation((state1) => state1);
    reducer2.mockImplementation((state2) => state2);

    const state = { a: { a: 3 }, b: { a: 7 } };

    const result = callback(state, { type: 'updateX', payload: 17 });

    expect(result).toBe(state);
    expect(result).toEqual({ a: { a: 3 }, b: { a: 7 } });

    expect(reducer1).toHaveBeenCalledTimes(1);
    expect(reducer1).toHaveBeenCalledWith({ a: 3 }, { payload: 17, type: 'updateX' });
    expect(reducer2).toHaveBeenCalledTimes(1);
    expect(reducer2).toHaveBeenCalledWith({ a: 7 }, { payload: 17, type: 'updateX' });
  });

  /**
   *
   */
  test('it should be throw an error when combineReducers() is called and the reducer returns undefined', () => {
    const reducer1 = jest.fn().mockReturnValue({ a: 42 });
    const reducer2 = jest.fn().mockReturnValue({ a: 13 });

    const callback = combineReducers({ a: reducer1, b: reducer2 });

    expect(callback).toBeInstanceOf(Function);
    expect(callback.length).toBe(2);

    reducer1.mockReset();
    reducer2.mockReset();

    reducer1.mockImplementation((state1) => state1);

    expect.assertions(4);
    try {
      callback({ a: { a: 3 }, b: { a: 7 } }, { type: 'updateX', payload: 17 });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Action "updateX" from Reducer "b" returns an undefined value');
    }
  });

  /**
   *
   */
  test('it should be not throw an error when checkedReducers() is called', () => {
    const reducer1 = jest.fn().mockReturnValue({ a: 42 });
    const reducer2 = jest.fn().mockReturnValue({ a: 13 });

    checkedReducers({ a: reducer1, b: reducer2 });

    expect(reducer1).toHaveBeenCalledTimes(1);
    expect(reducer1).toHaveBeenCalledWith(undefined, { payload: '', type: '' });
    expect(reducer2).toHaveBeenCalledTimes(1);
    expect(reducer2).toHaveBeenCalledWith(undefined, { payload: '', type: '' });
  });

  /**
   *
   */
  test('it should be throw an error when checkedReducers() is called [initialized state]', () => {
    const reducer1 = jest.fn();
    const reducer2 = jest.fn().mockReturnValue({ a: 13 });

    try {
      checkedReducers({ a: reducer1, b: reducer2 });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Reducer "a" did not return an initialized state');

      expect(reducer1).toHaveBeenCalledTimes(1);
      expect(reducer1).toHaveBeenCalledWith(undefined, { payload: '', type: '' });
      expect(reducer2).toHaveBeenCalledTimes(0);
    }
  });

  /**
   *
   */
  test('it should be throw an error when checkedReducers() is called [no reducer]', () => {
    const reducer1 = jest.fn().mockReturnValue({ a: 42 });
    const reducer2 = jest.fn().mockReturnValue({ a: 13 });

    try {
      checkedReducers({ a: reducer1, b: reducer2, c: '_' as any });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('No reducer function provided for key "c"');

      expect(reducer1).toHaveBeenCalledTimes(1);
      expect(reducer1).toHaveBeenCalledWith(undefined, { payload: '', type: '' });
      expect(reducer2).toHaveBeenCalledTimes(1);
      expect(reducer2).toHaveBeenCalledWith(undefined, { payload: '', type: '' });
    }
  });
});
