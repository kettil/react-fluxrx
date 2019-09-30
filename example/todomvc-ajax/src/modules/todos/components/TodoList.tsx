import React from 'react';

import { stateTodosItemsType } from '../types';

import TodoItem from './TodoItem';

type props = {
  filteredTodos: stateTodosItemsType;
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
