import { actionType } from '../actions';

export type stateType = { status: 'all' | 'completed' | 'active' };

const initialState: stateType = { status: 'all' };

export const reducer = (state = initialState, action: actionType): stateType => {
  switch (action.type) {
    case 'TODOS/SET_VISIBILITY':
      return { status: action.payload.status };

    default:
      return state;
  }
};

export default reducer;
