import { memo } from 'react-fluxrx';
import { useDispatch } from '../../../../store';
import Header, { Props } from './Header';
import React, { FunctionComponent } from 'react';
import { addTodo } from '../../../todos/actions';

const hocHeader = (Component: FunctionComponent<Props>): FunctionComponent<{}> => {
  const Wrapper: FunctionComponent<{}> = (props) => {
    const handleAdd = useDispatch(addTodo);

    return <Component {...props} addTodo={handleAdd} />;
  };

  return memo(Component, Wrapper);
};

export default hocHeader(Header);
