import { ActionReturnType } from 'react-fluxrx';

import { stateType as visibilityStateType } from './reducers/visibility';

export type actionType = ActionReturnType<typeof import('./actions')>;

export const addTodo = (text: string) =>
  ({
    type: 'todos/TODO_ADD',
    payload: { text },
  } as const);

export const deleteTodo = (id: number) =>
  ({
    type: 'todos/TODO_DELETE',
    payload: { id },
  } as const);

export const editTodo = (id: number, text: string) =>
  ({
    type: 'todos/TODO_EDIT',
    payload: { id, text },
  } as const);

export const completeTodo = (id: number) =>
  ({
    type: 'todos/COMPLETE_TODO',
    payload: { id },
  } as const);

export const completeAllTodos = () =>
  ({
    type: 'todos/COMPLETE_ALL',
    payload: {},
  } as const);

export const clearCompleted = () =>
  ({
    type: 'todos/COMPLETE_CLEAR_COMPLETED',
    payload: {},
  } as const);

export const setVisibility = (filter: visibilityStateType['filter']) =>
  ({
    type: 'todos/SET_VISIBILITY',
    payload: { filter },
  } as const);
