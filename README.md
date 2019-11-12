# react-fluxRx [BETA]

react-fluxRx is a predictable state container for react apps.
It combines the idea behind [flux](https://facebook.github.io/flux/)/[redux](https://www.npmjs.com/package/redux) and [RxJS](https://www.npmjs.com/package/rxjs).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Introduction](#introduction)
- [Building](#building)
- [Tests](#tests)
- [Prettier and Lint](#prettier-and-lint)

## Features

- Support one or many state containers
- Actions can synchronously or asynchronously
- Multiple updates can be made per action
- API similar to redux (e.g. you can use [reselect](https://github.com/reduxjs/reselect))
- Simple integration of e.g. [debounce](https://www.learnrxjs.io/operators/filtering/debounce.html) or [throttle](https://www.learnrxjs.io/operators/filtering/throttle.html) per action
- Middleware system
- Full TypeScript support
- Support for [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension)

## Installation

```bash
npm install -P react-fluxrx
```

## Introduction

In the [example folder](./example) there are two example projects, one a [simple application](./example/todomvc) and one [with AJAX](./example/todomvc-ajax/).

It is best to clone the project and enter the following command in the corresponding example folder:

```bash
npm i && npm start
```

### Example

Here is a very short and simple example

#### Main file

```typescript
// index.ts
import React from 'react';
import { render } from 'react-dom';
import App from '<path to first component>';

import { Provider, store } from './flux';

render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

#### Action file

```typescript
// actions.ts
import { ActionReturnType } from 'react-fluxrx';

export type actionType = ActionReturnType<typeof import('./index')>;

export function addTodo(item: string) ({
  type: 'ITEM_ADD',
  payload: { item },
}) as const;
// "as const" is very important
```

#### Reducer files

```typescript
// reducers/items.ts
import { reducerType } from 'react-fluxrx';
import { actionType } from '../actions';

export type stateType = { items: string[] };

const initialState: initialState = { items: [] };

export const reducer = (state = initialState, action: actionType) => {
  switch (action.type) {
    case 'ITEM_ADD':
      return {
        list: [...state.items, action.payload.item],
      };
    default:
      return state;
  }
};

export default reducer;
```

```typescript
// reducers/index.ts
import { combineReducers } from 'react-fluxrx';

import items from './items';

export const reducer = combineReducers({
  items,
});

export default reducer;
```

#### fluxRX file

```typescript
// flux.ts
import fluxRx, { combineReducers, middleware } from 'react-fluxrx';
import reducer from './reducers';

const initState = undefined;

const flux = fluxRx<stateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools()
  timeDebounce: 5,
});

export type stateType = state;

export const store = flux.store;
export const connect = flux.connect;
export const Provider = flux.Provider;
```

#### Container file

```typescript
// containers/Items.ts
import { dispatchType, bindActions } from 'react-fluxrx';
import { Items } from '../components/<component>';
import * as actions from '../action';
import { connect, stateType } from '../flux';

const mapStateToProps = (state: stateType) => ({
  items: state.items,
});

const mapDispatchToProps = (dispatch: dispatchType) => bindActions(actions, dispatch);

const ItemsConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Items);

export default ItemsConnect;
```

## Multiple Action

```typescript
// actions.ts
import { merge } from 'rxjs/internal/observable/merge';
import { of } from 'rxjs/internal/observable/of';
import { ActionReturnType } from 'react-fluxrx';

export type actionType = ActionReturnType<typeof import('./index')>;

export function addTodo(item: string) ({
  type: 'ITEM_ADD',
  payload: { item },
}) as const;

export function addTodoMulti(text) {
  const g1$ = of({
    type: 'ITEM_ADD',
    payload: { item, first:true },
  });

  const g2$ = of({
    type: 'ITEM_ADD',
    payload: { item, first:false },
  });

  return merge(g1$, g2$.pipe(delay(2500)));
};
```

## Debounce

```typescript
// containers/Items.ts
import { dispatchType, bindActions } from 'react-fluxrx';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { TodoList } from '../components/Items'
import * as actions from '../action'
import { connect, stateType } from '../flux'

const mapStateToProps = (state: stateType) => ({
  items: state.items,
});

const mapDispatchToProps (dispatch: dispatchType) => ({
  const debounce$ = new Subject<string>();

  debounce$.pipe(debounceTime(1000)).subscribe(
    (text) => dispatch(actions.addTodo(text))
  );

  return {
    addTodo: (text: string) => debounce$.next(text),
  };
});

const ItemsConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Items);

export default ItemsConnect;
```

## Building

Compile the application from TypeScript to JavaScript.

The following command is available:

- `npm run build`

  Builds the application

## Tests

**The following commands are available:**

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run test`       | Run all unit tests                  |
| `npm run test:watch` | Watching mode from unit test        |
| `npm run coverage`   | Creates a coverage report from test |

## Prettier and Lint

Ensures that the code is formatted uniformly and that the coding standards are adhered to.

The following commands are available:

- `npm run prettier`

  Changes the code formatting as defined in the Prettier setting.

- `npm run lint`

  Checks if the lint rules are followed. It calls the prettier command first.
