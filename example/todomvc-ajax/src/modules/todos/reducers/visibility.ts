import { actionTypes, constants, stateTodosVisibilityType, reducerTodosVisibilityType } from '../types';

/**
 *
 */
const initialState: stateTodosVisibilityType = constants.SHOW_ALL;

/**
 *
 * @param state
 * @param action
 */
export const reducer: reducerTodosVisibilityType = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_VISIBILITY:
      return action.payload;

    default:
      return state;
  }
};

/**
 *
 */
export default reducer;
