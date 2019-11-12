import { actionType } from '../actions';

export type stateType = { filter: 'all' | 'completed' | 'active' };

const initialState: stateType = { filter: 'all' };

export const reducer = (state = initialState, action: actionType): stateType => {
  switch (action.type) {
    case 'todos/SET_VISIBILITY':
      return {
        filter: action.payload.filter,
      };

    default:
      return state;
  }
};

export default reducer;
