import { actionTypes, stateTodosItemsType, reducerTodosItemsType } from '../types';

/**
 *
 */
const initialState: stateTodosItemsType = [
  {
    text: 'Use react-fluxRx',
    completed: false,
    id: 0,
  },
];

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
          completed: false,
          text: action.payload.text,
        },
      ];

    case actionTypes.TODO_DELETE:
      return state.filter((todo) => todo.id !== action.payload.id);

    case actionTypes.TODO_EDIT:
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo));

    case actionTypes.COMPLETE_TODO:
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo));

    case actionTypes.COMPLETE_ALL:
      const areAllMarked = state.every((todo) => todo.completed);

      return state.map((todo) => ({
        ...todo,
        completed: !areAllMarked,
      }));

    case actionTypes.COMPLETE_CLEAR_COMPLETED:
      return state.filter((todo) => todo.completed === false);

    default:
      return state;
  }
};

/**
 *
 */
export default reducer;
