/* tslint:disable:no-null-keyword */
import React from 'react';
import renderer from 'react-test-renderer';
import { memo } from './React';

describe('Check the react functions', () => {
  test('it should be that the wrapper uses the react memo function when memo() is called', () => {
    const InputXXL = ({ type }: { type: string }) => <input type={type} />;
    const Wrapper = ({ type, ...props }: { type: string }) => <InputXXL {...props} type={type} />;
    const Component = memo(InputXXL, Wrapper);

    expect(Component.$$typeof.toString()).toBe('Symbol(react.memo)');
  });

  test('it should be that the wrapper gets the component name when memo() is called', () => {
    let root: renderer.ReactTestRenderer | undefined;
    const InputXXL = ({ type }: { type: string }) => <input type={type} />;
    const Wrapper = ({ type, ...props }: { type: string }) => <InputXXL {...props} type={type} />;
    const Component = memo(InputXXL, Wrapper);

    renderer.act(() => {
      root = renderer.create(<Component type="number" />);
    });

    expect(typeof root!.root.type).toBe('function');
    expect((root!.root.type as any).displayName).toBe('InputXXL');
  });
});
