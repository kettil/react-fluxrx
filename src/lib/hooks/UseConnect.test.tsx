import React, { createContext } from 'react';
import renderer from 'react-test-renderer';
import { StoreType } from '../types';
import useStore from './useConnect';

const oldState = { value: 42 };

const unsubscribe = jest.fn();
const subscribe = jest.fn().mockReturnValue({ unsubscribe });
const dispatch = jest.fn();
const getState = jest.fn();

const mapStateToProps = (state: any) => state;
const mapDispatchToProps = (dispatcher: any) => ({ onClick: () => dispatcher('add') });

describe('Check the useStore hook', () => {
  let results: any[];
  let context: React.Context<StoreType<any, any>>;
  let Component: React.FunctionComponent<{ type: string }>;
  let root: renderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    getState.mockReturnValue(oldState);

    root = undefined;
    results = [];
    context = createContext<StoreType<any>>({ dispatch, getState, subscribe });

    Component = (props) => {
      const state = useStore(context, mapStateToProps, mapDispatchToProps, props);

      results.push(state);

      return React.createElement<any>('input', state);
    };
  });

  test('it should be return the element with merge props when the element is created', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
    expect(results.length).toBe(1);

    renderer.act(() => {
      root!.unmount();
    });

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  test('it should be the element is recreated when element is updated with new props', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');

    renderer.act(() => {
      root!.update(<Component type="number" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(3);
    expect(results[0] === results[1]).toBe(true);
    expect(results[1] === results[2]).toBe(false);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(3);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
  });

  test('it should be the element is recreated when element is updated with same props', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');

    renderer.act(() => {
      root!.update(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(2);
    expect(results[0] === results[1]).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
  });

  test('it should be the element iis recreated when the state is updated (new value)', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    const newState = { value: 13 };
    getState.mockReturnValue(newState);

    renderer.act(() => {
      subscribe.mock.calls[0][0](newState);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(2);
    expect(results[0] === results[1]).toBe(false);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
  });

  test('it should be the element iis recreated when the state is updated (same value but diff reference)', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    renderer.act(() => {
      subscribe.mock.calls[0][0]({ value: 42 });
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
  });

  test('it should be the element iis recreated when the state is updated (same reference)', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    renderer.act(() => {
      subscribe.mock.calls[0][0](oldState);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
  });
});
