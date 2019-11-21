import { createSelector } from 'reselect';

import { stateType } from '../reducer';

export const getTodosItems = (state: stateType) => state.todos.items;

export const getTodosVisibility = (state: stateType) => state.todos.visibility.filter;

export const getFilteredTodos = createSelector([getTodosVisibility, getTodosItems], (filter, todos) => {
  switch (filter) {
    case 'all':
      return todos;

    case 'completed':
      return todos.filter((t) => t.completed);

    case 'active':
      return todos.filter((t) => !t.completed);

    default:
      throw new Error('Unknown filter: ' + filter);
  }
});

export const getCompletedTodoCount = createSelector(
  [getTodosItems],
  (todos) => todos.filter((t) => t.completed).length,
);
