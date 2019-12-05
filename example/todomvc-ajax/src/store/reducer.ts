import { combineReducers } from 'react-fluxrx';
import todos, { StateTodosType } from '../modules/todos/reducers';

export type StateType = {
  todos: StateTodosType;
};

export const reducer = combineReducers<StateType>({
  todos,
});

export default reducer;
