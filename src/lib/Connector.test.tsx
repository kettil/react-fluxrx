/* tslint:disable:no-implicit-dependencies no-unused-expression */
import React from 'react';
import renderer from 'react-test-renderer';

const initState = { isState: true };
const dispatch = jest.fn();
const unsubscribe = jest.fn();
const subscribe = jest.fn().mockReturnValue({ unsubscribe });
const getState = jest.fn().mockReturnValue(initState);
const mapStateToProps = jest.fn<any, any>((state, props) => ({ ...props, ...state }));
const mapDispatchToProps = jest.fn<any, any>((_, props) => ({ action: (a: number) => a * 2 }));
const mergeProps = jest.fn<any, any>((mapState, mapDispatch, props) => ({ ...mapDispatch, ...props, ...mapState }));

import { connector } from './Connector';

/**
 *
 */
describe('Check the Connector function', () => {
  let Element: React.ComponentType<{ message1: string; message2: string }>;
  let context: React.Context<any>;

  /**
   *
   */
  beforeEach(() => {
    Element = ({ message1, message2 }) => (
      <span>
        {message1}
        {message2}
      </span>
    );
    context = React.createContext({ dispatch, subscribe, getState });
  });

  /**
   *
   */
  test('it should be create a connector component when connector() is called with a component', () => {
    const Callback = connector(
      ({ message1 }) => <span>{message1}</span>,
      context,
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    );

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<Callback message1={'Moin'} isPorps={true} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
    expect(getState).toHaveBeenCalledTimes(2);

    expect(mapStateToProps).toHaveBeenCalledTimes(1);
    expect(mapStateToProps).toHaveBeenCalledWith({ isState: true }, { isPorps: true, message1: 'Moin' });
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, { isPorps: true, message1: 'Moin' });
    expect(mergeProps).toHaveBeenCalledTimes(1);
    expect(mergeProps).toHaveBeenCalledWith(
      { isPorps: true, message1: 'Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
  });

  /**
   *
   */
  test('it should be updated the connector component when the props will be updated', () => {
    const Callback = connector(Element, context, mapStateToProps, mapDispatchToProps, mergeProps);

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<Callback message1={'Moin'} isPorps={true} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    renderer.act(() => {
      root.update(<Callback message1={'Moin Moin'} isPorps={true} />) as any;
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    expect(getState).toHaveBeenCalledTimes(5);

    expect(mapStateToProps).toHaveBeenCalledTimes(2);
    expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
    expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Moin Moin' });
    expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Moin Moin' });
    expect(mergeProps).toHaveBeenCalledTimes(2);
    expect(mergeProps).toHaveBeenNthCalledWith(
      1,
      { isPorps: true, message1: 'Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
    expect(mergeProps).toHaveBeenNthCalledWith(
      2,
      { isPorps: true, message1: 'Moin Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin Moin' },
    );
  });

  /**
   *
   */
  test('it should be updated the connector component when the state by the Context will be updated', () => {
    const Callback = connector(Element, context, mapStateToProps, mapDispatchToProps, mergeProps);

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<Callback message1={'Moin'} isPorps={true} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    renderer.act(() => {
      subscribe.mock.calls[0][0]({ isState: true, isUpdate: true, message2: 'Bye' });
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    expect(getState).toHaveBeenCalledTimes(3);

    expect(mapStateToProps).toHaveBeenCalledTimes(2);
    expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
    expect(mapStateToProps).toHaveBeenNthCalledWith(
      2,
      { isState: true, isUpdate: true, message2: 'Bye' },
      { isPorps: true, message1: 'Moin' },
    );
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
    expect(mergeProps).toHaveBeenCalledTimes(2);
    expect(mergeProps).toHaveBeenNthCalledWith(
      1,
      { isPorps: true, message1: 'Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
    expect(mergeProps).toHaveBeenNthCalledWith(
      2,
      { isPorps: true, isState: true, isUpdate: true, message1: 'Moin', message2: 'Bye' },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
  });

  /**
   *
   */
  test('it should be updated the connector component when the exists state by the Context will be updated', () => {
    const Callback = connector(Element, context, mapStateToProps, mapDispatchToProps, mergeProps);

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<Callback message1={'Moin'} isPorps={true} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    renderer.act(() => {
      subscribe.mock.calls[0][0](initState);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    expect(getState).toHaveBeenCalledTimes(2);

    expect(mapStateToProps).toHaveBeenCalledTimes(1);
    expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
    expect(mergeProps).toHaveBeenCalledTimes(1);
    expect(mergeProps).toHaveBeenNthCalledWith(
      1,
      { isPorps: true, message1: 'Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
  });

  /**
   *
   */
  test('it should be updated twice the connector component when first the props and then the state will be updated', () => {
    const Callback = connector(Element, context, mapStateToProps, mapDispatchToProps, mergeProps);

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<Callback message1={'Moin'} isPorps={true} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    renderer.act(() => {
      root.update(<Callback message1={'Moin Moin'} isPorps={true} />) as any;
    });

    expect(root!.toJSON()).toMatchSnapshot();

    renderer.act(() => {
      subscribe.mock.calls[1][0]({ isState: true, isUpdate: true, message2: 'Bye Bye' });
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    expect(getState).toHaveBeenCalledTimes(6);

    expect(mapStateToProps).toHaveBeenCalledTimes(3);
    expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
    expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Moin Moin' });
    expect(mapStateToProps).toHaveBeenNthCalledWith(
      3,
      { isState: true, isUpdate: true, message2: 'Bye Bye' },
      { isPorps: true, message1: 'Moin Moin' },
    );
    expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Moin Moin' });
    expect(mergeProps).toHaveBeenCalledTimes(3);
    expect(mergeProps).toHaveBeenNthCalledWith(
      1,
      { isPorps: true, message1: 'Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
    expect(mergeProps).toHaveBeenNthCalledWith(
      2,
      { isPorps: true, message1: 'Moin Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin Moin' },
    );
    expect(mergeProps).toHaveBeenNthCalledWith(
      3,
      { isPorps: true, message1: 'Moin Moin', message2: 'Bye Bye', isState: true, isUpdate: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin Moin' },
    );
  });

  /**
   *
   */
  test('it should be updated twice the connector component when first the state and then the props will be updated', () => {
    const Callback = connector(Element, context, mapStateToProps, mapDispatchToProps, mergeProps);

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<Callback message1={'Moin'} isPorps={true} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    renderer.act(() => {
      // update State
      const updateState = { isState: true, isUpdate: true, message2: 'Bye Bye' };
      subscribe.mock.calls[0][0](updateState);
      getState.mockReturnValue(updateState);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    renderer.act(() => {
      root.update(<Callback message1={'Moin Moin'} isPorps={true} />) as any;
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));

    expect(getState).toHaveBeenCalledTimes(8);

    expect(mapStateToProps).toHaveBeenCalledTimes(3);
    expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
    expect(mapStateToProps).toHaveBeenNthCalledWith(
      2,
      { isState: true, isUpdate: true, message2: 'Bye Bye' },
      { isPorps: true, message1: 'Moin' },
    );
    expect(mapStateToProps).toHaveBeenNthCalledWith(
      3,
      { isState: true, isUpdate: true, message2: 'Bye Bye' },
      { isPorps: true, message1: 'Moin Moin' },
    );
    expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
    expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Moin Moin' });
    expect(mergeProps).toHaveBeenCalledTimes(3);
    expect(mergeProps).toHaveBeenNthCalledWith(
      1,
      { isPorps: true, message1: 'Moin', isState: true },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
    expect(mergeProps).toHaveBeenNthCalledWith(
      2,
      { isPorps: true, isState: true, isUpdate: true, message1: 'Moin', message2: 'Bye Bye' },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin' },
    );
    expect(mergeProps).toHaveBeenNthCalledWith(
      3,
      { isPorps: true, isState: true, isUpdate: true, message1: 'Moin Moin', message2: 'Bye Bye' },
      { action: expect.any(Function) },
      { isPorps: true, message1: 'Moin Moin' },
    );
  });
});
