import { useDispatch, useSelector } from '../../../../store';
import { editTodo, deleteTodo, completeTodo } from '../../actions';
import TodoList, { Props } from './TodoList';
import { getFilteredTodos } from '../../selectors';
import React, { FunctionComponent } from 'react';
import { memo } from 'react-fluxrx';

type HocProps = {};

const hoc = (Component: FunctionComponent<Props>): FunctionComponent<HocProps> => {
  const Wrapper: FunctionComponent<HocProps> = ({ ...props }) => {
    const todos = useSelector((state) => getFilteredTodos(state));
    const editHandler = useDispatch(editTodo);
    const deleteHandler = useDispatch(deleteTodo);
    const completeHandler = useDispatch(completeTodo);

    return (
      <Component
        todos={todos}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
        completeHandler={completeHandler}
        {...props}
      />
    );
  };

  return memo(Component, Wrapper);
};

export default hoc(TodoList);
