import { createStore, middleware } from 'react-fluxrx';
import { reducer, stateType as state } from './modules/reducer';

const initState = undefined;

const handler = createStore<state>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools()],
  timeDebounce: 5,
});

export type stateType = state;

export const store = handler.store;
export const connect = handler.connect;
export const Provider = handler.Provider;
