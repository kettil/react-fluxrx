import React, { createContext } from 'react';
import renderer from 'react-test-renderer';
import { StoreType } from '../types';
import { createStoreHook } from './useStore';

const unsubscribe = jest.fn();
const subscribe = jest.fn().mockReturnValue({ unsubscribe });
const dispatch = jest.fn();
const getState = jest.fn();

describe('Check the useStore hook', () => {
  let context: React.Context<StoreType<any, any>>;
  let Component: React.FunctionComponent<{}>;

  beforeEach(() => {
    context = createContext<StoreType<any>>({ dispatch, getState, subscribe });
  });

  test('it should be .... when the element is created', () => {
    const useStore = createStoreHook(context);

    expect(typeof useStore).toBe('function');
  });

  test('it should be return the element with merge props when the element is created', () => {
    const useStore = createStoreHook(context);

    let store;

    Component = () => {
      store = useStore();

      return <span />;
    };

    renderer.act(() => {
      renderer.create(<Component />);
    });

    expect(store).toEqual({ dispatch, getState, subscribe });
  });
});
