import { createSelector } from 'reselect';

import { stateType } from '../reducer';
import { constants } from './types';

/**
 *
 * @param state
 */
export const getTodosItems = (state: stateType) => state.todos.items;

/**
 *
 * @param state
 */
export const getTodosVisibility = (state: stateType) => state.todos.visibility;

/**
 *
 */
export const getFilteredTodos = createSelector(
  [getTodosVisibility, getTodosItems],
  (filter, todos) => {
    switch (filter) {
      case constants.SHOW_ALL:
        return todos;

      case constants.SHOW_COMPLETED:
        return todos.filter((t) => t.completed);

      case constants.SHOW_ACTIVE:
        return todos.filter((t) => !t.completed);

      default:
        throw new Error('Unknown filter: ' + filter);
    }
  },
);

/**
 *
 */
export const getCompletedTodoCount = createSelector(
  [getTodosItems],
  (todos) => todos.filter((t) => t.completed).length,
);
