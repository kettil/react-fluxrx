import { createStore, middleware, GetStateTypeFactory, ActionTypeFactory } from 'react-fluxrx';
import { reducer, StateType } from './reducer';

const initState = undefined;

const handler = createStore<StateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools(), middleware.ajax({ url: 'http://localhost:4001' })],
  timeDebounce: 25,
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
