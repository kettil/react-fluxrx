import { createStore, middleware } from 'react-fluxrx';
import { reducer } from './reducer';

const initState = undefined;

const handler = createStore<GlobalStateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools()],
  timeDebounce: 5,
});

export type GlobalStateType = ReturnType<typeof reducer>;

export const store = handler.store;
export const connect = handler.connect;
export const Consumer = handler.Consumer;
export const Provider = handler.Provider;
export const useDispatch = handler.useDispatch;
export const useSelector = handler.useSelector;
export const useStore = handler.useStore;
