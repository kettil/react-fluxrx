import { createStore, middleware, GetStateTypeFactory, ActionTypeFactory } from 'react-fluxrx';
import { reducer, StateType } from './reducer';

const initState = undefined;

const handler = createStore<StateType>(reducer, initState, {
  middleware: [middleware.logger(), middleware.devTools()],
  timeDebounce: 10,
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
