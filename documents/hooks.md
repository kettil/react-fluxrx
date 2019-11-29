# Hooks

|                             |                     |                         |                               |
| --------------------------- | ------------------- | ----------------------- | ----------------------------- |
| [Overview](./README.md)     | [Store](./store.md) | [Actions](./actions.md) | [Reducers](./reducers.md)     |
| [Selectors](./selectors.md) | [Hooks](./hooks.md) | [HOC](./hoc.md)         | [Middleware](./middleware.md) |
|                             |                     |                         |                               |

The hooks allow you to interact with the store.

In general, the hooks should only be used in the [HOC](./hoc.md).
This ensures that the view and logic are separate.
In the following examples, the hooks for simpler examples are directly in the component.

## useSelector

The useSelector can be used to read the data from the state.
If the selected area of the state changes, the element is automatically re-rendered.

Reading or selecting the state should always be done via the [selector](./selectors.md) functions!

If a variable is to be used from outside the callback, then this variable must be added to the `debs` array.
The `debs` array is passed as a second parameter (see second example).

### API

❗❗coming soon❗❗

### Example

```typescript
// src/modules/todos/components/TodoList/index.tsx
import { useSelector } from '../../../../store';
import { getFilteredTodos } from '../../selectors';

export type Props = {};

export const CountComponent: FunctionComponent<Props> = ({}) => {
  const todos = useSelector((state) => getFilteredTodos(state));

  return <span>{todos.length}</span>;
};

// or

import { getTodosAndCompletedCount } from '../../selectors';

export type Props = { completed: boolean };

export const CountComponent: FunctionComponent<Props> = ({ completed }) => {
  const data = useSelector((state) => getTodosAndCompletedCount(state, completed), [completed]);

  return (
    <span>
      {data.completedCount} / {data.todosCount}
    </span>
  );
};
```

## useDispatch

With the useDispatch you can change the state.

If no action is passed, the dispatch itself is returned.
This is recommended if you want to combine a lot of actions.

If you pass an action, you get back an optimized callback, which you call with the same arguments as the action. (recommended ways).

### API

❗❗coming soon❗❗

### Example

```typescript
// src/modules/todos/components/TodoList/index.tsx
import { useDispatch } from '../../../../store';
import { clickAction } from '../../actions';

export type Props = {};

export const ButtonComponent: FunctionComponent<Props> = ({}) => {
  const onClick = useDispatch(clickAction);

  return <button onClick={}>Click me</button>;
};

// or (not recommended)

export const ButtonComponent: FunctionComponent<Props> = ({}) => {
  const dispatch = useDispatch();
  const onClick = (id: number) => clickAction(id);

  return <button onClick={}>Click me</button>;
};
```

## useStore

Through the useStore you get the complete store back.

These hacks should only be used if you write a more complex plugin or hack for example

### API

❗❗coming soon❗❗

### Example

```typescript
// src/modules/todos/components/TodoList/index.tsx
import { useStore } from '../../../../store';

export type Props = {};

export const ButtonComponent: FunctionComponent<Props> = ({}) => {
  const store = useStore();

  // store.dispatch()
  // store.getState()
  // store.subscribe()

  return <span>??</span>;
};
```
