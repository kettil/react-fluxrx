import { of } from 'rxjs';
import { stateType } from '../reducers/items';

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

export const completeAllTodos = () =>
  ({
    type: 'TODOS/LOADING',
    payload: {},

    ajax: {
      method: 'GET',
      path: '/todos',
      response: (data: any) => {
        const todos: stateType = data;
        const areAllMarked = todos.every((todo) => todo.completed);

        return of(...todos.map((todo) => completeTodo(todo.id, !areAllMarked)));
      },
    },
  } as const);

export const clearCompleted = () =>
  ({
    type: 'TODOS/LOADING',
    payload: {},

    ajax: {
      method: 'GET',
      path: '/todos?completed=true',
      response: (data: any) => {
        const todos: stateType = data;

        return of(...todos.map((d) => deleteTodo(d.id)));
      },
    },
  } as const);
