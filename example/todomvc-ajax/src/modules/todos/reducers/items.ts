import { actionTypes, stateTodosItemsType, reducerTodosItemsType } from '../types';

/**
 *
 */
const initialState: stateTodosItemsType = [];

/**
 *
 * @param state
 * @param action
 */
export const reducer: reducerTodosItemsType = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TODO_ADD:
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: action.payload.completed || false,
          text: action.payload.text,
        },
      ];

    case actionTypes.TODO_DELETE:
      return state.filter((todo) => todo.id !== action.payload.id);

    case actionTypes.TODO_EDIT:
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo));

    case actionTypes.COMPLETE_TODO:
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, completed: action.payload.completed } : todo,
      );

    default:
      return state;
  }
};

/**
 *
 */
export default reducer;
