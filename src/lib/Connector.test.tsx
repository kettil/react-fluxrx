/* tslint:disable:no-implicit-dependencies no-unused-expression */
import React from 'react';
import renderer from 'react-test-renderer';

import { BehaviorSubject } from 'rxjs';

const initState = { isState: true };
const dispatch = jest.fn();
const mapStateToProps = jest.fn<any, any>((state, props) => ({ ...props, ...state }));
const mapDispatchToProps = jest.fn<any, any>((_, props) => ({ action: (a: number) => a * 2 }));

import { connector } from './Connector';

type message1Type = { message1: string; message2?: string; isProps: boolean };

describe('Check the Connector function', () => {
  let Component: React.ComponentType<message1Type>;
  let context: React.Context<any>;
  let subject: BehaviorSubject<any>;

  let subscribe: any;
  let getState: any;

  let resultMapStatePart: any;

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

    resultMapStatePart = { isState: true, isUpdate: true };
  });

  test('it should be create a connector component when connector() is called with a component', () => {
    const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
      ({ message1 }) => <span>{message1}</span>,
      context,
      mapStateToProps,
      mapDispatchToProps,
    );

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={false} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();

    expect(dispatch).toHaveBeenCalledTimes(0);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
    expect(getState).toHaveBeenCalledTimes(1);

    expect(mapStateToProps).toHaveBeenCalledTimes(1);
    expect(mapStateToProps).toHaveBeenCalledWith({ isState: true }, { isProps: false, message1: 'Moin' });
    expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
    expect(mapDispatchToProps).toHaveBeenCalledWith(dispatch, { isProps: false, message1: 'Moin' });
  });

  test('it should be unsubscribe from Observable when the component is unmount', () => {
    const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
      ({ message1, isProps }) => (
        <span>
          {message1} - {isProps ? 1 : 2}
        </span>
      ),
      context,
      mapStateToProps,
      mapDispatchToProps,
    );

    let root: renderer.ReactTestRenderer;

    expect(subject.observers.length).toBe(0);

    renderer.act(() => {
      root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
    });

    expect(subject.observers.length).toBe(1);

    root!.unmount();

    expect(subject.observers.length).toBe(0);
  });

  describe('Create one Component', () => {
    test('it should be updated the connector component when the props will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root.update(<ConnectorComponent message1={'Moin Moin'} isProps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(3);

      expect(mapStateToProps).toHaveBeenCalledTimes(2);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isProps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isProps: true, message1: 'Moin Moin' });
    });

    test('it should be updated the connector component when the state by the Context will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart, message2: 'Bye' });
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(2);

      expect(mapStateToProps).toHaveBeenCalledTimes(2);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart, message2: 'Bye' },
        { isProps: true, message1: 'Moin' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
    });

    test('it should be updated the connector component when the exists state by the Context will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
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
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
    });

    test('it should be updated the connector component when the equal state by the Context will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...initState });
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(1);

      expect(mapStateToProps).toHaveBeenCalledTimes(2);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenCalledTimes(1);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
    });

    test('it should be updated twice the connector component when first the props and then the state will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root.update(<ConnectorComponent message1={'Moin Moin'} isProps={true} />) as any;
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart, message2: 'Bye Bye' });
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(4);

      expect(mapStateToProps).toHaveBeenCalledTimes(3);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isProps: true, message1: 'Moin Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Moin Moin' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isProps: true, message1: 'Moin Moin' });
    });

    test('it should be updated twice the connector component when first the state and then the props will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root: renderer.ReactTestRenderer;

      renderer.act(() => {
        root = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart, message2: 'Bye Bye' });
      });

      expect(root!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root.update(<ConnectorComponent message1={'Moin Moin'} isProps={true} />) as any;
      });

      expect(root!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(4);

      expect(mapStateToProps).toHaveBeenCalledTimes(3);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        2,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Moin Moin' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isProps: true, message1: 'Moin Moin' });
    });
  });

  describe('Create two Components', () => {
    test('it should be updated the connector components when the props will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isProps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root1.update(<ConnectorComponent message1={'Moin Moin'} isProps={true} />) as any;
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2.update(<ConnectorComponent message1={'Good morning'} isProps={true} />) as any;
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(6);

      expect(mapStateToProps).toHaveBeenCalledTimes(4);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isProps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(3, { isState: true }, { isProps: true, message1: 'Moin Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { isState: true },
        { isProps: true, message1: 'Good morning' },
      );
      expect(mapDispatchToProps).toHaveBeenCalledTimes(4);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isProps: true, message1: 'Hello' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(3, dispatch, { isProps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(4, dispatch, { isProps: true, message1: 'Good morning' });
    });

    test('it should be updated the connector components when the state by the Context will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isProps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart, message2: 'Bye' });
      });

      expect(root1!.toJSON()).toMatchSnapshot();
      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(4);

      expect(mapStateToProps).toHaveBeenCalledTimes(4);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isProps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart, message2: 'Bye' },
        { isProps: true, message1: 'Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart, message2: 'Bye' },
        { isProps: true, message1: 'Hello' },
      );

      expect(mapDispatchToProps).toHaveBeenCalledTimes(2);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isProps: true, message1: 'Hello' });
    });

    test('it should be updated twice the connector components when first the props and then the state will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isProps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root1.update(<ConnectorComponent message1={'Moin Moin'} isProps={true} />) as any;
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2.update(<ConnectorComponent message1={'Good morning'} isProps={true} />) as any;
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart, message2: 'Bye Bye' });
      });

      expect(root1!.toJSON()).toMatchSnapshot();
      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(8);

      expect(mapStateToProps).toHaveBeenCalledTimes(6);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isProps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(3, { isState: true }, { isProps: true, message1: 'Moin Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { isState: true },
        { isProps: true, message1: 'Good morning' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        5,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Moin Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        6,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Good morning' },
      );

      expect(mapDispatchToProps).toHaveBeenCalledTimes(4);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isProps: true, message1: 'Hello' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(3, dispatch, { isProps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(4, dispatch, { isProps: true, message1: 'Good morning' });
    });

    test('it should be updated twice the connector components when first the state and then the props will be updated', () => {
      const ConnectorComponent = connector<React.ComponentType<message1Type>, message1Type>(
        Component,
        context,
        mapStateToProps,
        mapDispatchToProps,
      );

      let root1: renderer.ReactTestRenderer;
      let root2: renderer.ReactTestRenderer;

      renderer.act(() => {
        root1 = renderer.create(<ConnectorComponent message1={'Moin'} isProps={true} />);
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2 = renderer.create(<ConnectorComponent message1={'Hello'} isProps={true} />);
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        subject.next({ ...resultMapStatePart, message2: 'Bye Bye' });
      });

      expect(root1!.toJSON()).toMatchSnapshot();
      expect(root2!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root1.update(<ConnectorComponent message1={'Moin Moin'} isProps={true} />) as any;
      });

      expect(root1!.toJSON()).toMatchSnapshot();

      renderer.act(() => {
        root2.update(<ConnectorComponent message1={'Good morning'} isProps={true} />) as any;
      });

      expect(root2!.toJSON()).toMatchSnapshot();

      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(subscribe).toHaveBeenCalledTimes(2);
      expect(subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(getState).toHaveBeenCalledTimes(8);

      expect(mapStateToProps).toHaveBeenCalledTimes(6);
      expect(mapStateToProps).toHaveBeenNthCalledWith(1, { isState: true }, { isProps: true, message1: 'Moin' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(2, { isState: true }, { isProps: true, message1: 'Hello' });
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        3,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        4,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Hello' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        5,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Moin Moin' },
      );
      expect(mapStateToProps).toHaveBeenNthCalledWith(
        6,
        { ...resultMapStatePart, message2: 'Bye Bye' },
        { isProps: true, message1: 'Good morning' },
      );

      expect(mapDispatchToProps).toHaveBeenCalledTimes(4);
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(1, dispatch, { isProps: true, message1: 'Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(2, dispatch, { isProps: true, message1: 'Hello' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(3, dispatch, { isProps: true, message1: 'Moin Moin' });
      expect(mapDispatchToProps).toHaveBeenNthCalledWith(4, dispatch, { isProps: true, message1: 'Good morning' });
    });
  });
});
