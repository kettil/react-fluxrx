import React, { createContext, useState } from 'react';
import renderer from 'react-test-renderer';
import { StoreType } from '../types';
import { createSelectorHook } from './useSelector';

const oldState = { value: 42 };

const unsubscribe = jest.fn();
const subscribe = jest.fn().mockReturnValue({ unsubscribe });
const dispatch = jest.fn();
const getState = jest.fn();

describe('Check the useSelector hook', () => {
  let count: number;
  let results: any[];
  let Component: React.FunctionComponent<{ type: string; trigger?: (a: (i: number) => void) => void }>;
  let root: renderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    getState.mockReturnValue(oldState);

    root = undefined;
    count = 0;
    results = [];

    const context = createContext<StoreType<any>>({ dispatch, getState, subscribe });
    const useSelector = createSelectorHook(context);

    Component = (props) => {
      const [n, setstate] = useState(0);
      if (props.trigger) {
        props.trigger((i) => setstate(i));
      }

      const data = useSelector((state: any) => {
        count += 1;

        return { ...props, ...state, n };
      });

      results.push(data);

      return React.createElement<any>('input', data);
    };
  });

  afterEach(() => {
    if (root) {
      renderer.act(() => {
        root!.unmount();
      });
    }
  });

  test('it should be return the element with merge props when the element is created', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(1);
    expect(count).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);

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
    expect(results.length).toBe(2);
    expect(results[0] === results[1]).toBe(false);
    expect(count).toBe(2);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledTimes(1);
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
    expect(results[0] === results[1]).toBe(false);
    expect(count).toBe(2);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  test('it should be the element is not recreated when element is updated with equal element', () => {
    const Element = <Component type="text" />;

    renderer.act(() => {
      root = renderer.create(Element);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');

    renderer.act(() => {
      root!.update(Element);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(1);
    expect(count).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  test('it should be the element is recreated when the state is updated (new value)', () => {
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
    expect(count).toBe(2);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  test('it should be the element is recreated when the state is updated (same value but diff reference)', () => {
    renderer.act(() => {
      root = renderer.create(<Component type="text" />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    const newState = { value: 42 };
    getState.mockReturnValue(newState);

    renderer.act(() => {
      subscribe.mock.calls[0][0](newState);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(2);
    expect(results[0] === results[1]).toBe(false);
    expect(count).toBe(2);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  test('it should be the element is not recreated when the state is updated (same reference)', () => {
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
    expect(count).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  test('it should be the element is recreated when a rerun through another hook (new value)', () => {
    let callback: (i: number) => void;
    const trigger = (cb: any) => (callback = cb);

    renderer.act(() => {
      root = renderer.create(<Component type="text" trigger={trigger} />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    renderer.act(() => {
      callback(42);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(2);
    expect(results[0] === results[1]).toBe(false);
    expect(count).toBe(2);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  test('it should be the element is not recreated when a rerun through another hook (same value)', () => {
    let callback: (i: number) => void;
    const trigger = (cb: any) => (callback = cb);

    renderer.act(() => {
      root = renderer.create(<Component type="text" trigger={trigger} />);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    renderer.act(() => {
      callback(0);
    });

    expect(root!.toJSON()).toMatchSnapshot('json');
    expect(results).toMatchSnapshot('results');
    expect(results.length).toBe(1);
    expect(count).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(getState).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });
});
