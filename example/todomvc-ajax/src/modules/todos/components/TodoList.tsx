import React, { FC } from 'react';

import { stateType as itemsStateType } from '../reducers/items';
import TodoItem from './TodoItem';

type Props = {
  filteredTodos: itemsStateType;
  editTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
  completeTodo: (id: number, completed: boolean) => void;
};

const TodoList: FC<Props> = ({ filteredTodos, editTodo, deleteTodo, completeTodo }) => (
  <ul className="todo-list">
    {filteredTodos.map((todo) => (
      <TodoItem key={todo.id} todo={todo} editTodo={editTodo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    ))}
  </ul>
);

export default TodoList;
