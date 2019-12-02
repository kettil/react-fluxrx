import React, { createContext } from 'react';
import renderer from 'react-test-renderer';
import { map } from 'rxjs/operators';
import { StoreType } from '../types';
import { createDispatchRxHook } from './useDispatchRx';

const subscribe = jest.fn();
const dispatch = jest.fn();
const getState = jest.fn();

describe('Check the useDispatchRx hook', () => {
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

  test.only('it should be return an action callback when useDispatchRx is called with one operator', () => {
    expect.assertions(4);

    const useDispatchRx = createDispatchRxHook(context);

    Component = () => {
      const action = useDispatchRx(
        (a: number, b: string) => ({ type: 'a', payload: { a, b } } as const),
        map<[number, string], [number, string]>(([a, b]) => [a * 2, b + b]),
      );

      action(2, '#');

      return React.createElement<any>('span');
    };

    renderer.act(() => {
      root = renderer.create(<Component />);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ payload: { a: 4, b: '##' }, type: 'a' });
    expect(getState).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(0);
  });

  test.only('it should be return an action callback when useDispatchRx is called with two operators', () => {
    expect.assertions(4);

    const useDispatchRx = createDispatchRxHook(context);

    Component = () => {
      const action = useDispatchRx(
        (a: number, b: string) => ({ type: 'a', payload: { a, b } } as const),
        map<[number, string], [number, string]>(([a, b]) => [a * a, b + b]),
        map<[number, string], [number, string]>(([a, b]) => [a * a, b + b]),
      );

      action(2, '#');

      return React.createElement<any>('span');
    };

    renderer.act(() => {
      root = renderer.create(<Component />);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ payload: { a: 16, b: '####' }, type: 'a' });
    expect(getState).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(0);
  });
});
