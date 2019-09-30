import fluxRx, { middleware } from 'react-fluxrx';

import { reducer, stateType } from './modules/reducer';

const initState = undefined;

const flux = fluxRx<stateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools()],
  timeDebounce: 5,
});

export type stateType = stateType;

export const store = flux.store;
export const connect = flux.connect;
export const Provider = flux.Provider;
