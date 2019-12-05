import { createSelector } from 'reselect';
import { State } from '../../../store';

export const getTodosItems = (state: State) => state.todos.items;

export const getTodosVisibility = (state: State) => state.todos.visibility.status;

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

export const getTodosCompletedStatus = (_: State, completed: boolean = true) => completed;

export const getTodosAndCompletedCount = createSelector(
  [getTodosItems, getTodosCompletedStatus],
  (todos, completed) => ({
    todosCount: todos.length,
    completedCount: todos.filter((t) => t.completed === completed).length,
  }),
);
