import { createActionType, createReducerType, createStateType } from 'react-fluxrx';

import { stateType } from '../reducer';

/**
 *
 */
export enum actionTypes {
  SHOW_ALL = '@@todos/SHOW_ALL',
  SHOW_COMPLETED = '@@todos/SHOW_COMPLETED',
  SHOW_ACTIVE = '@@todos/SHOW_ACTIVE',

  TODO_ADD = '@@todos/TODO_ADD',
  TODO_DELETE = '@@todos/TODO_DELETE',
  TODO_EDIT = '@@todos/TODO_EDIT',

  COMPLETE_TODO = '@@todos/COMPLETE_TODO',
  COMPLETE_ALL = '@@todos/COMPLETE_ALL',
  COMPLETE_CLEAR_COMPLETED = '@@todos/COMPLETE_CLEAR_COMPLETED',

  SET_VISIBILITY = '@@todos/SET_VISIBILITY',
}

/**
 *
 */
export enum constants {
  SHOW_ALL = 'all',
  SHOW_COMPLETED = 'completed',
  SHOW_ACTIVE = 'active',
}

/**
 *
 */
export type stateTodosType = {
  items: Array<{
    text: string;
    completed: boolean;
    id: number;
  }>;
  visibility: constants;
};

export type actionTodosItemType = createActionType<stateType, stateTodosType['items']>;
export type actionTodosVisibilityType = createActionType<stateType, stateTodosType['visibility']>;

export type stateTodosItemsType = createStateType<stateTodosType['items']>;
export type stateTodosVisibilityType = createStateType<stateTodosType['visibility']>;

export type reducerTodosItemsType = createReducerType<stateTodosType['items']>;
export type reducerTodosVisibilityType = createReducerType<stateTodosType['visibility']>;
