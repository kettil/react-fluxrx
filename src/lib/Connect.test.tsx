import React from 'react';
import renderer from 'react-test-renderer';
import { BehaviorSubject } from 'rxjs';
import { connectFactory } from './Connect';

describe('Check the connect function', () => {
  test('it should be return a connected component when connectFactory() and his callbacks is called', () => {
    const dispatch = jest.fn();
    const subject = new BehaviorSubject({ isState: true });
    const context: React.Context<any> = React.createContext({
      dispatch,
      subscribe: (cb: any) => subject.subscribe(cb),
      getState: () => subject.getValue(),
    });

    const connect = connectFactory(context);
    expect(connect).toBeInstanceOf(Function);

    const callback = connect();
    expect(callback).toBeInstanceOf(Function);
    expect(callback.length).toBe(1);

    const Component = () => React.createElement('div', undefined, 'Hello World');
    const ConnectComponent = callback(Component);

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(React.createElement(ConnectComponent, {}, undefined));
    });

    expect(root!.toJSON()).toMatchSnapshot();
  });
});
