# rxFlux

## Beispiel

```javascript
// action/index.js
export function addTodo(text) {
  return {
    type: 'add',
    payload: text,
  };
}
```

```javascript
// reducers/index.js
import {
  reducerType
} from 'rxFlux';

export type stateType = {
  list: string[];
};

export default function reducer: reducerType<stateType> = (
  state = { list: [] },
  action,
) {
  switch (action.type) {
    case 'add':
      return {
        list: [...state.list, action.payload],
      };
    default:
      return state;
  }
};
```

```javascript
// flux.js
import rxFlux, { reducerType } from 'rxFlux';
import reducer, { stateType } from 'reducers/index';

const flux = rxFlux(reducer);

export const store = flux.store;
export const connect = flux.connect;
export const Provider = flux.Provider;
```

```javascript
// containers/index.js
import { TodoList } from '../components/TodoList'
import { addTodo } from '../action/index'
import {
  mergeProps,
  mapStateToPropsType,
  mapDispatchToPropsType
} from 'rxFlux';

import {
  connect,
  stateType
} from '../flux'

const mapStateToProps: mapStateToPropsType<stateType, {}, { texts: string[] }> = (state) => ({
  texts: state.list,
});

const mapDispatchToProps: mapDispatchToPropsType<{}, {}> = (dispatch, props) => ({
  return {
    onAdd: (text: any) => dispatch(text),
  };
});

const ItemsConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Items);
```

## Multiple Action

```javascript
// action/index.js
import { merge } from 'rxjs/internal/observable/merge';
import { ajax } from 'rxjs/internal/observable/dom/ajax'
import { of } from 'rxjs/internal/observable/of';


export function addTodo(text) {
  return {
    type: 'add',
    payload: {
      loading: false,
      text: text,
    },
  };
};

export function addTodoSave(text) {
  const async$ = ajax({
    url:  'https://example.com/api',
    body: {text: text},
  }).map((data) => {
    return addTodo(data.text);
  });

  const sync$ = of({
    type: 'save',
    payload: {
      loading: true,
  });

  return merge(sync$, async$);
};
```

```javascript
const g1$ = of({
  type: 'add',
  payload: '-- :-) 8 --',
}) as rxComponents.actionType;
const g2$ = of({
  type: 'add',
  payload: '-- :-) 9 --',
}) as rxComponents.actionType;

const g2_1$ = g2$.pipe(delay(2500));
const g3$ = merge(g1$, g2_1$);
```

## Debounce

```javascript
// containers/index.js
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

// ...

const mapDispatchToProps: mapDispatchToPropsType<{}, {}> = (dispatch, props) => ({
  const debounce$ = new Subject();

  debounce$.pipe(debounceTime(500)).subscribe(
    (text) => dispatch(rAction(text))
  );

  return {
    onAdd: (text: any) => debounce$.next(text),
  };
});

// ...
```
