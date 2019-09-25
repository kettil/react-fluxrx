/* tslint:disable:no-implicit-dependencies no-unused-expression */
import React from 'react';
import renderer from 'react-test-renderer';

import { BehaviorSubject } from 'rxjs';

import { createConnect } from './Connect';

/**
 *
 */
describe('Check the connect function', () => {
  /**
   *
   */
  test('it should be return a connected component when createConnect() and his callbacks is called', () => {
    const dispatch = jest.fn();
    const subject = new BehaviorSubject({ isState: true });
    const context: React.Context<any> = React.createContext({
      dispatch,
      subscribe: (cb: any) => subject.subscribe(cb),
      getState: () => subject.getValue(),
    });

    const connect = createConnect(context);
    expect(connect).toBeInstanceOf(Function);

    const callback = connect<{ message: string }>();
    expect(callback).toBeInstanceOf(Function);
    expect(callback.length).toBe(1);

    const Component = ({ message }: { message: string }) => <div>Hello {message}</div>;
    const ConnectComponent = callback(Component);

    let root: renderer.ReactTestRenderer;

    renderer.act(() => {
      root = renderer.create(<ConnectComponent message={'World'} />);
    });

    expect(root!.toJSON()).toMatchSnapshot();
  });
});
