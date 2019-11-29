# Actions

|                             |                     |                         |                               |
| --------------------------- | ------------------- | ----------------------- | ----------------------------- |
| [Overview](./README.md)     | [Store](./store.md) | [Actions](./actions.md) | [Reducers](./reducers.md)     |
| [Selectors](./selectors.md) | [Hooks](./hooks.md) | [HOC](./hoc.md)         | [Middleware](./middleware.md) |
|                             |                     |                         |                               |

## Description

An action initiates a change of state.
The action function builds an action object for the reducer.
Each action object requires a `type` (type: string) and a `payload` (type: object).

The action function can return the following types:

- The action object itself
- An RxJS observable stream
- A Promise
- A callback function

For complex actions, it is recommended that you define the action objects in individual actions, and the complex action calls these simple actions.

> ❗ **Important** ❗
>
> ```typescript
> return {
>   type: 'MODULE/ACTION_TYPE',
>   payload: {
>     /* ... */
>   },
> } as const;
> ```
>
> At the end of each action object must be `as const`, this ensures type inheritance.

## Action object

Returns the `action object` for the changes directly.
This is the default way for changes...

### Example

```typescript
// src/modules/todos/actions/items.ts
export const actionFactoryRaw = (id: number, text: string) =>
  ({
    type: 'MODULE/ACTION_TYPE',
    payload: { id, text },
  } as const);
```

## RxJS observable stream

Returns the `action object` or several as an observable stream.

All the magic of RxJS can be used, such as multiple actions, delayed actions, etc...
It is important that the value of the stream is an action object...

### Example

```typescript
// src/modules/todos/actions/items.ts
export const actionFactoryWithObservable1 = (id: number, text: string) => {
  // do something

  return of({
    type: 'MODULE/ACTION_TYPE',
    payload: { id, text },
  } as const);
};

// or

export const actionFactoryWithObservable2 = (id: number, text: string) => {
  // do something

  return of(actionFactoryRaw(id, '#1: ' + text), actionFactoryRaw(id, '#2: ' + text));
};

// or

export const actionFactoryWithObservable3 = (id: number, text: string) => {
  // do something

  const withDelay = of(actionFactoryRaw(id, '#2: ' + text)).pipe(delay(2500));

  // do something

  return of(actionFactoryRaw(id, '#1: ' + text)).pipe(merge(withDelay));
};
```

## Promise

Returns the `action object` or the `RxJS observable stream` as promise/async.

### Example

```typescript
// src/modules/todos/actions/items.ts
export const actionFactoryWithPromise1 = async (id: number, text: string) => {
  // do something

  return {
    type: 'MODULE/ACTION_TYPE',
    payload: { id, text },
  } as const;
};

// or

export const actionFactoryWithPromise2 = (id: number, text: string) => {
  // do something

  return Promise.resolve({
    type: 'MODULE/ACTION_TYPE',
    payload: { id, text },
  } as const);
};

// or

export const actionFactoryWithPromise3 = async (id: number, text: string) => {
  // do something

  return of(actionFactoryRaw(id, '#1: ' + text), actionFactoryRaw(id, '#2: ' + text));
};
```

## Callback Function

Return value is a callback function.
The return value of the callback function is then an `Promise`, `RxJS observable stream` or directly an `action object`.
The first argument of the callback function is a function to get the current state.

### Example

```typescript
// src/modules/todos/actions/items.ts
export const actionFactoryWithCallback = (id: number, text: string) => (getState: GetStateType) => {
  // do something

  const n = selectorFunction(getState());

  return {
    type: 'MODULE/ACTION_TYPE',
    payload: { id, text: n + '#: ' + text },
  } as const;
};
```
