/* tslint:disable:no-implicit-dependencies no-unused-expression */
import React from 'react';
import renderer from 'react-test-renderer';

import { BehaviorSubject } from 'rxjs';

const initState = { isState: true };
const dispatch = jest.fn();
const mapStateToProps = jest.fn<any, any>((state, props) => ({ ...props, ...state }));
const mapDispatchToProps = jest.fn<any, any>((_, props) => ({ action: (a: number) => a * 2 }));
const mergeProps = jest.fn<any, any>((mapState, mapDispatch, props) => ({ ...mapDispatch, ...props, ...mapState }));

import { connector } from './Connector';

/**
 *
 */
describe('Check the Connector function', () => {
  let Component: React.ComponentType<{ message1: string; message2: string }>;
  let context: React.Context<any>;
  let subject: BehaviorSubject<any>;

  let subscribe: any;
  let getState: any;

  let resultMapStatePart1: any;
  let resultMapStatePart2: any;
  let resultMapDispatch: any;

  /**
   *
   */
  beforeEach(() => {
    subject = new BehaviorSubject(initState);

    const store = {
      dispatch,
      subscribe: (cb: any) => subject.subscribe(cb),
      getState: () => subject.getValue(),
    };

    subscribe = jest.spyOn(store, 'subscribe');
    getState = jest.spyOn(store, 'getState');

    Component = ({ message1, message2 }) => (
      <span>
        {message1}
        {message2}
      </span>
    );
    context = React.createContext(store);

    resultMapStatePart1 = { isPorps: true, isState: true };
    resultMapStatePart2 = { isState: true, isUpdate: true };
    resultMapDispatch = { action: expect.any(Function) };
  });

  /**
   *
   */
  test('it should be create a connector component when connector() is called with a component', () => {
    const ConnectorComponent = connector(
      ({ message1 }) => <span>{message1}</span>,
      context,
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    );

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
    expect(getState).toHaveBeenCalledTimes(1);

    expect(mapStateToProps).toHaveBeenCalledTimes(1);
    expect(mapStateToProps).toHaveBeenCalledWith({ isState: true }, { isPorps: true, message1: 'Moin' });
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, { isPorps: true, message1: 'Moin' });
    expect(mergeProps).toHaveBeenCalledTimes(1);
    expect(mergeProps).toHaveBeenCalledWith({ ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
      isPorps: true,
      message1: 'Moin',
    });
  });

  /**
   *
   */
  describe('Create one Component', () => {
    /**
     *
     */
    test('it should be updated the connector component when the props will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root.update(<ConnectorComponent message1={'Moin Moin'} isPorps={true} />) as any;
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(3);

      expect(mapStateToProps).toHaveBeenCalledTimes(2);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Moin Moin' });
      expect(mergeProps).toHaveBeenCalledTimes(2);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart1, message1: 'Moin Moin' },
        resultMapDispatch,
        {
          isPorps: true,
          message1: 'Moin Moin',
        },
      );
    });

    /**
     *
     */
    test('it should be updated the connector component when the state by the Context will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart2, message2: 'Bye' });
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(2);

      expect(mapStateToProps).toHaveBeenCalledTimes(2);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart2, message2: 'Bye' },
        { isPorps: true, message1: 'Moin' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mergeProps).toHaveBeenCalledTimes(2);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Moin', message2: 'Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin' },
      );
    });

    /**
     *
     */
    test('it should be updated the connector component when the exists state by the Context will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next(initState);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(1);

      expect(mapStateToProps).toHaveBeenCalledTimes(1);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mergeProps).toHaveBeenCalledTimes(1);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
    });

    /**
     *
     */
    test('it should be updated twice the connector component when first the props and then the state will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root.update(<ConnectorComponent message1={'Moin Moin'} isPorps={true} />) as any;
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart2, message2: 'Bye Bye' });
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(4);

      expect(mapStateToProps).toHaveBeenCalledTimes(3);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Moin Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Moin Moin' });
      expect(mergeProps).toHaveBeenCalledTimes(3);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart1, message1: 'Moin Moin' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart1, message1: 'Moin Moin', message2: 'Bye Bye', isUpdate: true },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin Moin' },
      );
    });

    /**
     *
     */
    test('it should be updated twice the connector component when first the state and then the props will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart2, message2: 'Bye Bye' });
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root.update(<ConnectorComponent message1={'Moin Moin'} isPorps={true} />) as any;
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(4);

      expect(mapStateToProps).toHaveBeenCalledTimes(3);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Moin Moin' });
      expect(mergeProps).toHaveBeenCalledTimes(3);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Moin', message2: 'Bye Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Moin Moin', message2: 'Bye Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin Moin' },
      );
    });
  });

  /**
   *
   */
  describe('Create two Components', () => {
    /**
     *
     */
    test('it should be updated the connector components when the props will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isPorps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root1.update(<ConnectorComponent message1={'Moin Moin'} isPorps={true} />) as any;
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2.update(<ConnectorComponent message1={'Good morning'} isPorps={true} />) as any;
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(6);

      expect(mapStateToProps).toHaveBeenCalledTimes(4);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(3, { isState: true }, { isPorps: true, message1: 'Moin Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { isState: true },
        { isPorps: true, message1: 'Good morning' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(4);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Hello' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(3, dispatch, { isPorps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(4, dispatch, { isPorps: true, message1: 'Good morning' });
      expect(mergeProps).toHaveBeenCalledTimes(4);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(2, { ...resultMapStatePart1, message1: 'Hello' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Hello',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart1, message1: 'Moin Moin' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart1, message1: 'Good morning' },
        resultMapDispatch,
        { isPorps: true, message1: 'Good morning' },
      );
    });

    /**
     *
     */
    test('it should be updated the connector components when the state by the Context will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isPorps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart2, message2: 'Bye' });
      });

      expect(root1!.toJSON()).toMatchSnapshot();
      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(4);

      expect(mapStateToProps).toHaveBeenCalledTimes(4);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart2, message2: 'Bye' },
        { isPorps: true, message1: 'Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart2, message2: 'Bye' },
        { isPorps: true, message1: 'Hello' },
      );

      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Hello' });

      expect(mergeProps).toHaveBeenCalledTimes(4);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(2, { ...resultMapStatePart1, message1: 'Hello' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Hello',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Moin', message2: 'Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Hello', message2: 'Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Hello' },
      );
    });

    /**
     *
     */
    test('it should be updated twice the connector components when first the props and then the state will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isPorps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root1.update(<ConnectorComponent message1={'Moin Moin'} isPorps={true} />) as any;
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2.update(<ConnectorComponent message1={'Good morning'} isPorps={true} />) as any;
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart2, message2: 'Bye Bye' });
      });

      expect(root1!.toJSON()).toMatchSnapshot();
      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(8);

      expect(mapStateToProps).toHaveBeenCalledTimes(6);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(3, { isState: true }, { isPorps: true, message1: 'Moin Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { isState: true },
        { isPorps: true, message1: 'Good morning' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        5,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        6,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Good morning' },
      );

      expect(mapDispatchToProps).toHaveBeenCalledTimes(4);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Hello' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(3, dispatch, { isPorps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(4, dispatch, { isPorps: true, message1: 'Good morning' });

      expect(mergeProps).toHaveBeenCalledTimes(6);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(2, { ...resultMapStatePart1, message1: 'Hello' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Hello',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart1, message1: 'Moin Moin' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart1, message1: 'Good morning' },
        resultMapDispatch,
        { isPorps: true, message1: 'Good morning' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        5,
        { ...resultMapStatePart1, message1: 'Moin Moin', message2: 'Bye Bye', isUpdate: true },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        6,
        { ...resultMapStatePart1, message1: 'Good morning', message2: 'Bye Bye', isUpdate: true },
        resultMapDispatch,
        { isPorps: true, message1: 'Good morning' },
      );
    });

    /**
     *
     */
    test('it should be updated twice the connector components when first the state and then the props will be updated', () => {
      const ConnectorComponent = connector(Component, context, mapStateToProps, mapDispatchToProps, mergeProps);

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isPorps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isPorps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart2, message2: 'Bye Bye' });
      });

      expect(root1!.toJSON()).toMatchSnapshot();
      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root1.update(<ConnectorComponent message1={'Moin Moin'} isPorps={true} />) as any;
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2.update(<ConnectorComponent message1={'Good morning'} isPorps={true} />) as any;
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(8);

      expect(mapStateToProps).toHaveBeenCalledTimes(6);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isPorps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isPorps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Hello' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        5,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        6,
        { ...resultMapStatePart2, message2: 'Bye Bye' },
        { isPorps: true, message1: 'Good morning' },
      );

      expect(mapDispatchToProps).toHaveBeenCalledTimes(4);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isPorps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isPorps: true, message1: 'Hello' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(3, dispatch, { isPorps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(4, dispatch, { isPorps: true, message1: 'Good morning' });

      expect(mergeProps).toHaveBeenCalledTimes(6);
      expect(mergeProps).toHaveBeenNthCalledWith(1, { ...resultMapStatePart1, message1: 'Moin' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Moin',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(2, { ...resultMapStatePart1, message1: 'Hello' }, resultMapDispatch, {
        isPorps: true,
        message1: 'Hello',
      });
      expect(mergeProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Moin', message2: 'Bye Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Hello', message2: 'Bye Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Hello' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        5,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Moin Moin', message2: 'Bye Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Moin Moin' },
      );
      expect(mergeProps).toHaveBeenNthCalledWith(
        6,
        { ...resultMapStatePart1, isUpdate: true, message1: 'Good morning', message2: 'Bye Bye' },
        resultMapDispatch,
        { isPorps: true, message1: 'Good morning' },
      );
    });
  });
});
