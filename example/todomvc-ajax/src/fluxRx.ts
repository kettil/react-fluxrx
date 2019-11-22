import { createStore, middleware } from 'react-fluxrx';
import { reducer, stateType as state } from './modules/reducer';

const initState = undefined;

const store = createStore<stateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools(), middleware.ajax({ url: 'http://localhost:4001' })],
  timeDebounce: 5,
});

export type stateType = state;

export const dispatch = store.dispatch;
export const connect = store.connect;
