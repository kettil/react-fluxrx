import fluxRx, { middleware } from 'react-fluxrx';

import { reducer, stateType as state } from './modules/reducer';
import * as todoActions from './modules/todos/actions';

const initState = undefined;

const flux = fluxRx<stateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools(), middleware.ajax({ url: 'http://localhost:4001' })],
  timeDebounce: 5,
});

flux.store.dispatch({
  type: 'load',
  payload: {},

  ajax: {
    path: '/todos',
    method: 'GET',
    response: (data: any) => data.map((d: any) => todoActions.loadTodo(d.id, d.text, d.completed)),
  },
});

export type stateType = state;

export const store = flux.store;
export const connect = flux.connect;
export const Provider = flux.Provider;
