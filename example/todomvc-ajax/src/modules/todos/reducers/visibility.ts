import { ActionType } from '../actions';

export type StateTodosVisibilityType = { status: 'all' | 'completed' | 'active' };

const initialState: StateTodosVisibilityType = { status: 'all' };

export const reducer = (state = initialState, action: ActionType): StateTodosVisibilityType => {
  switch (action.type) {
    case 'TODOS/SET_VISIBILITY':
      return { status: action.payload.status };

    default:
      return state;
  }
};

export default reducer;
