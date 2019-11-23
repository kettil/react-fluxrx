import React, { createContext } from 'react';
import renderer from 'react-test-renderer';
import { StoreType } from '../types';
import { createDispatchHook } from './useDispatch';

const subscribe = jest.fn();
const dispatch = jest.fn();
const getState = jest.fn();

describe('Check the useConnect hook', () => {
  let context: React.Context<StoreType<{}, any>>;
  let Component: React.FunctionComponent<{}>;
  let root: renderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    context = createContext<StoreType<{}>>({ dispatch, getState, subscribe });

    root = undefined;
  });

  afterEach(() => {
    if (root) {
      renderer.act(() => {
        root!.unmount();
      });
    }
  });

  test('it should be return the dispatch when useDispatch is called without action', () => {
    expect.assertions(4);

    const useDispatch = createDispatchHook(context);

    Component = () => {
      const localDispatch = useDispatch();

      expect(localDispatch).toBe(dispatch);

      return React.createElement<any>('span');
    };

    renderer.act(() => {
      root = renderer.create(<Component />);
    });

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(0);
  });

  test('it should be return the bounded action when useDispatch is called with action', () => {
    expect.assertions(5);

    const useDispatch = createDispatchHook(context);

    Component = () => {
      const action = useDispatch((a: number) => ({ type: 'a', payload: { a } }));

      expect(action).not.toBe(dispatch);

      action(5);

      return React.createElement<any>('span');
    };

    renderer.act(() => {
      root = renderer.create(<Component />);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ payload: { a: 5 }, type: 'a' });
    expect(getState).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(0);
  });
});
