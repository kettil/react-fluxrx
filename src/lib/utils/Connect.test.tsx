/* tslint:disable:no-null-keyword */
import React from 'react';
import renderer from 'react-test-renderer';
import { defaultMapDispatchToProps, defaultMapStateToProps, memo, mergeProps } from './connect';

describe('Check the connect functions', () => {
  test('it should be return an object when defaultMapStateToProps() is called', () => {
    const returnValue = defaultMapStateToProps();

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  test('it should be return an object when defaultMapDispatchToProps() is called', () => {
    const returnValue = defaultMapDispatchToProps();

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  test('it should be return the merged object when mergeProps() is called with empty objects', () => {
    const returnValue = mergeProps({}, {}, {});

    expect(typeof returnValue).toBe('object');
    expect(returnValue).not.toBeNull();
  });

  const testFunction = (a: any) => a;
  const testTrue: Array<[object, object, object]> = [
    [{ text: 'string1' }, { mode: 1 }, { text: 'string1', update: testFunction, mode: 1 }],
    [{ text: 'string1' }, { text: 'string2' }, { text: 'string1', update: testFunction }],
  ];

  test.each(testTrue)(
    'it should be return the merged object when mergeProps() is called [%p, %p]',
    (stateProps, ownProps, expected) => {
      const returnValue = mergeProps(stateProps, { update: testFunction }, ownProps);

      expect(returnValue).toEqual(expected);
    },
  );

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
