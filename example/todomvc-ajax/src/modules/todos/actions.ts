import { ActionReturnType } from 'react-fluxrx';
import { of } from 'rxjs';

import { stateType as itemsStateType } from './reducers/items';
import { stateType as visibilityStateType } from './reducers/visibility';

export type actionType = ActionReturnType<typeof import('./actions')>;

export const insertTodo = (id: number, text: string, completed: boolean) =>
  ({
    type: 'todos/TODO_ADD',
    payload: {
      id,
      text,
      completed,
    },
  } as const);

export const addTodo = (text: string) =>
  ({
    type: 'todos/LOADING',
    payload: {},

    ajax: {
      method: 'POST',
      path: '/todos',
      data: { text, completed: false },
      response: (data: any) => insertTodo(data.id, data.text, data.completed),
    },
  } as const);

export const deleteTodo = (id: number) =>
  ({
    type: 'todos/TODO_DELETE',
    payload: { id },

    ajax: {
      method: 'DELETE',
      path: `/todos/${id}`,
    },
  } as const);

export const editTodo = (id: number, text: string) =>
  ({
    type: 'todos/TODO_EDIT',
    payload: { id, text },

    ajax: {
      method: 'PATCH',
      path: '/todos/' + id,
      data: { text },
    },
  } as const);

export const completeTodo = (id: number, completed: boolean) =>
  ({
    type: 'todos/COMPLETE_TODO',
    payload: { id, completed },

    ajax: {
      method: 'PATCH',
      path: '/todos/' + id,
      data: { completed },
    },
  } as const);

export const completeAllTodos = () =>
  ({
    type: 'todos/LOADING',
    payload: {},

    ajax: {
      method: 'GET',
      path: '/todos',
      response: (data: any) => {
        const todos: itemsStateType = data;
        const areAllMarked = todos.every((todo) => todo.completed);

        return todos.map((todo) => completeTodo(todo.id, !areAllMarked));
      },
    },
  } as const);

export const clearCompleted = () =>
  ({
    type: 'todos/LOADING',
    payload: {},

    ajax: {
      method: 'GET',
      path: '/todos?completed=true',
      response: (data: any) => {
        const todos: itemsStateType = data;

        return of(...todos.map((d) => deleteTodo(d.id)));
      },
    },
  } as const);

export const setVisibility = (filter: visibilityStateType['filter']) =>
  ({
    type: 'todos/SET_VISIBILITY',
    payload: { filter },
  } as const);
