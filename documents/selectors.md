# Selectors

|                             |                     |                         |                               |
| --------------------------- | ------------------- | ----------------------- | ----------------------------- |
| [Overview](./README.md)     | [Store](./store.md) | [Actions](./actions.md) | [Reducers](./reducers.md)     |
| [Selectors](./selectors.md) | [Hooks](./hooks.md) | [HOC](./hoc.md)         | [Middleware](./middleware.md) |
|                             |                     |                         |                               |

## Description

The selectors return the values from the state.
Outside the selector files a value should never be read from the state.

If only a certain part of a record is to be returned, this should be done via package [reselect](https://www.npmjs.com/package/reselect) or similar packages.

## Example

Look at the example directly in the [file](../example/todomvc-ajax/src/modules/todos/selectors/index.ts)!

```typescript
// src/modules/todos/selectors.ts
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
```

`reselect` only calls the callback function when the `getAllTodos` or `getVisibility` functions return a new value.
