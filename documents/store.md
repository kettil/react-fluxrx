# Store

|                             |                     |                         |                               |
| --------------------------- | ------------------- | ----------------------- | ----------------------------- |
| [Overview](./README.md)     | [Store](./store.md) | [Actions](./actions.md) | [Reducers](./reducers.md)     |
| [Selectors](./selectors.md) | [Hooks](./hooks.md) | [HOC](./hoc.md)         | [Middleware](./middleware.md) |
|                             |                     |                         |                               |

## Description

The store initializes the state handler and accepts the reducer.

### API

```typescript
createStore<StateType>(reducer, initState, options);
```

| Parameter            | Default | Description                                                         |
| -------------------- | :-----: | ------------------------------------------------------------------- |
| reducer              |         | Expect the [reducer](./reducers.md)                                 |
| initState            |         | The initial value of the state                                      |
| options.middleware   |   []    | List all [middleware](./middleware.md)                              |
| options.timeDebounce |   10    | Microtimestamp for the debouncer before a state change is triggered |

### Example

Look at the example directly in the [file](../example/todomvc-ajax/src/store/index.ts)!

```typescript
// src/store/index.ts
import { createStore, middleware, GetStateTypeFactory, ActionTypeFactory } from 'react-fluxrx';
import { reducer, StateType } from './reducer';

const initState = undefined;

const handler = createStore<StateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools()],
  timeDebounce: 5,
});

export type State = StateType;
export type ActionType = ActionTypeFactory<StateType>;
export type GetStateType = GetStateTypeFactory<StateType>;
export const store = handler.store;
export const Consumer = handler.Consumer;
export const Provider = handler.Provider;
export const useDispatch = handler.useDispatch;
export const useSelector = handler.useSelector;
export const useStore = handler.useStore;
```
