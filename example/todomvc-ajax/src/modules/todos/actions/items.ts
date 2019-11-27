import { of, merge } from 'rxjs';
import { GetStateType } from '../../../store';
import { getTodosItems } from '../selectors';
// For the action debugging
//import { ActionType } from '../../../store';

export const insertTodo = (id: number, text: string, completed: boolean) =>
  ({
    type: 'TODOS/TODO_ADD',
    payload: {
      id,
      text,
      completed,
    },
  } as const);

export const addTodo = (text: string) =>
  ({
    type: 'TODOS/LOADING',
    payload: {},

    ajax: {
      method: 'POST',
      path: '/todos',
      data: { text, completed: false },
      // sata validation is missing
      success: (data: any) => insertTodo(data.id, data.text, data.completed),
    },
  } as const);

export const deleteTodo = (id: number) =>
  ({
    type: 'TODOS/TODO_DELETE',
    payload: { id },

    ajax: {
      method: 'DELETE',
      path: `/todos/${id}`,
    },
  } as const);

export const editTodo = (id: number, text: string) =>
  ({
    type: 'TODOS/TODO_EDIT',
    payload: { id, text },

    ajax: {
      method: 'PATCH',
      path: '/todos/' + id,
      data: { text },
    },
  } as const);

export const completeTodo = (id: number, completed: boolean) =>
  ({
    type: 'TODOS/COMPLETE_TODO',
    payload: { id, completed },

    ajax: {
      method: 'PATCH',
      path: '/todos/' + id,
      data: { completed },
    },
  } as const);

export const completeAllTodos = () => (getState: GetStateType) => {
  const allTodos = getTodosItems(getState());
  // When all todos are finished, then status is true otherwise false
  const status = allTodos.every((todo) => todo.completed);
  const todos = allTodos.filter((todo) => todo.completed === status).map((todo) => completeTodo(todo.id, !status));

  return merge(of({ type: 'TODOS/LOADING', payload: {} } as const), of(...todos));
};

export const clearCompleted = () => (getState: GetStateType) => {
  const todos = getTodosItems(getState())
    .filter((todo) => todo.completed === true)
    .map((todo) => deleteTodo(todo.id));

  return merge(of({ type: 'TODOS/LOADING', payload: {} } as const), of(...todos));
};
