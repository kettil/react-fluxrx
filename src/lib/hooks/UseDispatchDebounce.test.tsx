import React, { createContext } from 'react';
import renderer from 'react-test-renderer';
import { StoreType } from '../types';
import { createDispatchDebounceHook } from './useDispatchDebounce';

const subscribe = jest.fn();
const dispatch = jest.fn();
const getState = jest.fn();

describe('Check the useDispatchDebounce hook', () => {
  let context: React.Context<StoreType<{}>>;
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

  test.only('it should be return an action callback when useDispatchDebounce is called', async () => {
    expect.assertions(5);

    const useDispatchDebounce = createDispatchDebounceHook(context);
    const mockAction = jest.fn((a: number, b: string) => ({ type: 'a', payload: { a, b } } as const));

    Component = () => {
      const action = useDispatchDebounce(mockAction, 250);

      action(2, '#');

      return React.createElement<any>('span');
    };

    renderer.act(() => {
      root = renderer.create(<Component />);
    });

    expect(dispatch).toHaveBeenCalledTimes(0);

    await new Promise((r) => setTimeout(r, 500));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ payload: { a: 2, b: '#' }, type: 'a' });
    expect(getState).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(0);
  });
});
