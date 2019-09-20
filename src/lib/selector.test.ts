const addMock = jest.fn();
const dispatch = jest.fn();
const mapStateToProps = jest.fn((s) => ({ todos: s.todos }));
const mapDispatchToProps = jest.fn(() => ({ add: addMock }));
const mergeProps = jest.fn((a, b, c) => ({ ...b, ...a, ...c }));

import { Selector } from './selector';

/**
 *
 */
describe('Check the class Selector', () => {
  let selector: Selector;

  /**
   *
   */
  beforeEach(() => {
    selector = new Selector();
  });

  /**
   *
   */
  test('initialize the class', () => {
    expect(selector).toBeInstanceOf(Selector);
  });

  /**
   *
   */
  describe('Check the create function', () => {
    /**
     *
     */
    test('it should be return a callback function when create() is called', () => {
      const callback = selector.create(dispatch, mapStateToProps, mapDispatchToProps, mergeProps);

      expect(callback).toBeInstanceOf(Function);
      expect(callback.length).toBe(2);

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(mapStateToProps).toHaveBeenCalledTimes(0);
      expect(mapDispatchToProps).toHaveBeenCalledTimes(0);
      expect(mergeProps).toHaveBeenCalledTimes(0);
    });

    /**
     *
     */
    test('it should be return mapped object when callback() is called', () => {
      const callback = selector.create(dispatch, mapStateToProps, mapDispatchToProps, mergeProps);

      expect(callback).toBeInstanceOf(Function);

      const result = callback({ todos: [], users: [] }, { filter: 'all' });

      expect(result).toEqual({ todos: [], add: addMock, filter: 'all' });

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(mergeProps).toHaveBeenCalledTimes(1);
    });

    /**
     *
     */
    test('it should be return mapped object when callback() twice is called with different props', () => {
      const callback = selector.create(dispatch, mapStateToProps, mapDispatchToProps, mergeProps);

      expect(callback).toBeInstanceOf(Function);

      const todos = [1, 3, 4];

      const result1 = callback({ todos, users: [5, 7, 9] }, { filter: 'all' });

      expect(result1).toEqual({ todos, add: addMock, filter: 'all' });

      const result2 = callback({ todos, users: [] }, { filter: 'completed' });

      expect(result2).not.toBe(result1);
      expect(result2).toEqual({ todos, add: addMock, filter: 'completed' });

      expect(dispatch).toHaveBeenCalledTimes(0);

      expect(mapStateToProps).toHaveBeenCalledTimes(2);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { todos: [1, 3, 4], users: [5, 7, 9] }, { filter: 'all' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { todos: [1, 3, 4], users: [] }, { filter: 'completed' });

      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { filter: 'all' });

      expect(mergeProps).toHaveBeenCalledTimes(2);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { todos }, { add: addMock }, { filter: 'all' });
      expect(mergeProps).toHaveBeenNthCalledWith(2, { todos }, { add: addMock }, { filter: 'completed' });
    });

    /**
     *
     */
    test('it should be return mapped object when callback() twice is called with same state and props', () => {
      const callback = selector.create(dispatch, mapStateToProps, mapDispatchToProps, mergeProps);

      expect(callback).toBeInstanceOf(Function);

      const state = { todos: [1, 3, 4], users: [] };

      const result1 = callback(state, { filter: 'all' });

      expect(result1).toEqual({ todos: state.todos, add: addMock, filter: 'all' });

      const result2 = callback(state, { filter: 'all' });

      expect(result2).toBe(result1);
      expect(result2).toEqual({ todos: state.todos, add: addMock, filter: 'all' });

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(mapStateToProps).toHaveBeenCalledTimes(1);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { todos: [1, 3, 4], users: [] }, { filter: 'all' });
      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, { filter: 'all' });
      expect(mergeProps).toHaveBeenCalledTimes(1);
      expect(mergeProps).toHaveBeenCalledWith({ todos: [1, 3, 4] }, { add: addMock }, { filter: 'all' });
    });

    /**
     *
     */
    test('it should be return mapped object when callback() twice is called with same state and different props', () => {
      const callback = selector.create(dispatch, mapStateToProps, mapDispatchToProps, mergeProps);

      expect(callback).toBeInstanceOf(Function);

      const state = { todos: [1, 3, 4], users: [] };

      const result1 = callback(state, { filter: 'all' });

      expect(result1).toEqual({ todos: state.todos, add: addMock, filter: 'all' });

      const result2 = callback(state, { filter: 'completed' });

      expect(result2).not.toBe(result1);
      expect(result2).toEqual({ todos: state.todos, add: addMock, filter: 'completed' });

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(mapStateToProps).toHaveBeenCalledTimes(1);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { todos: [1, 3, 4], users: [] }, { filter: 'all' });
      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, { filter: 'all' });
      expect(mergeProps).toHaveBeenCalledTimes(2);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { todos: [1, 3, 4] }, { add: addMock }, { filter: 'all' });
      expect(mergeProps).toHaveBeenNthCalledWith(2, { todos: [1, 3, 4] }, { add: addMock }, { filter: 'completed' });
    });
  });

  /**
   *
   */
  describe('Check the helper functions', () => {
    /**
     *
     */
    test('it should be return the map() value when map() is called and cachedValue is undefined', () => {
      const map = jest.fn().mockReturnValue({ a: 42 });

      const result = selector.map(undefined, true, map);

      expect(result).toEqual([{ a: 42 }, true]);

      expect(map).toHaveBeenCalledTimes(1);
      expect(map).toHaveBeenCalledWith();
    });

    /**
     *
     */
    test('it should be return the map() value when map() is called and values are changed', () => {
      const map = jest.fn().mockReturnValue({ a: 42 });

      const result = selector.map({ a: 13 }, true, map);

      expect(result).toEqual([{ a: 42 }, true]);

      expect(map).toHaveBeenCalledTimes(1);
      expect(map).toHaveBeenCalledWith();
    });

    /**
     *
     */
    test('it should be return called value when map() is called and values are changed but result is equal', () => {
      const map = jest.fn().mockReturnValue({ a: 13 });

      const cached = { a: 13 };

      const result = selector.map(cached, true, map);

      expect(result).toEqual([cached, false]);
      expect(result[0]).toBe(cached);

      expect(map).toHaveBeenCalledTimes(1);
      expect(map).toHaveBeenCalledWith();
    });

    /**
     *
     */
    test('it should be return called value function when map() is called and values are not changed', () => {
      const map = jest.fn().mockReturnValue({ a: 42 });

      const cached = { a: 13 };

      const result = selector.map(cached, false, map);

      expect(result).toEqual([cached, false]);
      expect(result[0]).toBe(cached);

      expect(map).toHaveBeenCalledTimes(0);
    });
  });
});
