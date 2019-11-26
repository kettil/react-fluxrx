import React, { FunctionComponent } from 'react';
import { stateType as itemsStateType } from '../../reducers/items';
import TodoListItem from './TodoListItem';

export type Props = {
  todos: itemsStateType;
  editHandler: (id: number, text: string) => void;
  deleteHandler: (id: number) => void;
  completeHandler: (id: number, completed: boolean) => void;
};

const TodoList: FunctionComponent<Props> = ({ todos, ...handlers }) => (
  <ul className="todo-list">
    {todos.map((todo) => (
      <TodoListItem key={todo.id} todo={todo} {...handlers} />
    ))}
  </ul>
);

export default TodoList;
