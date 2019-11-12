import fluxRx, { middleware } from 'react-fluxrx';

import { reducer, stateType as state } from './modules/reducer';

const initState = undefined;

const flux = fluxRx<stateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools(), middleware.ajax({ url: 'http://localhost:4001' })],
  timeDebounce: 5,
});

export type stateType = state;

export const store = flux.store;
export const connect = flux.connect;
export const Provider = flux.Provider;
