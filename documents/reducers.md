# Reducers

|                             |                     |                         |                               |
| --------------------------- | ------------------- | ----------------------- | ----------------------------- |
| [Overview](./README.md)     | [Store](./store.md) | [Actions](./actions.md) | [Reducers](./reducers.md)     |
| [Selectors](./selectors.md) | [Hooks](./hooks.md) | [HOC](./hoc.md)         | [Middleware](./middleware.md) |
|                             |                     |                         |                               |

## Description

A reducer changes the local state (for which it is responsible) when a corresponding action is triggered.

> ❗ **Important** ❗
>
> The "default" value must always be the passing state and
> the return value must be a object.

## Submodule reducer

### Example

Look at the example directly in the [file](../example/todomvc-ajax/src/modules/todos/reducers/visibility.ts)!

```typescript
// src/modules/todos/reducers/visibility.ts
import { ActionType } from '../actions';

export type StateTodosVisibilityType = { status: 'all' | 'completed' | 'active' };

const initialState: StateTodosVisibilityType = { status: 'all' };

export const reducer = (state = initialState, action: ActionType): StateTodosVisibilityType => {
  switch (action.type) {
    case 'TODOS/SET_VISIBILITY':
      return { status: action.payload.status };

    default:
      return state;
  }
};

export default reducer;
```

## Module reducer

If a module has several reducers, then they are combined by the `combineReducers`.
In the context of the state, the `combineReducers` is an object and all reducers that are passed are subvalues.

### Example

Look at the example directly in the [file](../example/todomvc-ajax/src/modules/todos/reducers/visibility.ts)!

```typescript
// src/modules/todos/reducers/visibility.ts
import { combineReducers } from 'react-fluxrx';
import items, { StateTodosItemsType } from './items';
import visibility, { StateTodosVisibilityType } from './visibility';

export type StateTodosType = {
  items: StateTodosItemsType;
  visibility: StateTodosVisibilityType;
};

export const reducer = combineReducers<StateTodosType>({
  items,
  visibility,
});

export default reducer;
```

## Application reducer

At the end all module reducers are combined to create the global state.
At the same time also the global state is defined as type.

### Example

Look at the example directly in the [file](../example/todomvc-ajax/src/store/reducer.ts)!

```typescript
// src/store/reducer.ts
import { combineReducers } from 'react-fluxrx';
import todos, { StateTodosType } from '../modules/todos/reducers';

export type StateType = {
  todos: StateTodosType;
};

export const reducer = combineReducers<StateType>({
  todos,
});

export default reducer;
```
