import { createSelector } from 'reselect';
import { GlobalStateType } from '../../../store';

export const getTodosItems = (state: GlobalStateType) => state.todos.items;

export const getTodosVisibility = (state: GlobalStateType) => state.todos.visibility.status;

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

export const getTodosAndCompletedCount = createSelector([getTodosItems], (todos) => ({
  todosCount: todos.length,
  completedCount: todos.filter((t) => t.completed).length,
}));
