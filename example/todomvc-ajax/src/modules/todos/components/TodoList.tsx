import React from 'react';

import { stateType as itemsStateType } from '../reducers/items';
import TodoItem from './TodoItem';

type props = {
  filteredTodos: itemsStateType;
  editTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
  completeTodo: (id: number, completed: boolean) => void;
};

const TodoList = ({ filteredTodos, editTodo, deleteTodo, completeTodo }: props) => (
  <ul className="todo-list">
    {filteredTodos.map((todo) => (
      <TodoItem key={todo.id} todo={todo} editTodo={editTodo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    ))}
  </ul>
);

export default TodoList;
