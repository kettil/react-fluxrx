// For the action debugging
//import { ActionType } from '../../../store';

export const addTodo = (text: string) =>
  ({
    type: 'TODOS/TODO_ADD',
    payload: { text },
  } as const);

export const deleteTodo = (id: number) =>
  ({
    type: 'TODOS/TODO_DELETE',
    payload: { id },
  } as const);

export const editTodo = (id: number, text: string) =>
  ({
    type: 'TODOS/TODO_EDIT',
    payload: { id, text },
  } as const);

export const completeTodo = (id: number) =>
  ({
    type: 'TODOS/COMPLETE_TODO',
    payload: { id },
  } as const);

export const completeAllTodos = () =>
  ({
    type: 'TODOS/COMPLETE_ALL',
    payload: {},
  } as const);

export const clearCompleted = () =>
  ({
    type: 'TODOS/COMPLETE_CLEAR_COMPLETED',
    payload: {},
  } as const);
