import { actionType } from '../actions';

export type stateType = Array<{
  text: string;
  completed: boolean;
  id: number;
}>;

const initialState: stateType = [
  {
    text: 'Use react-fluxRx',
    completed: false,
    id: 0,
  },
];

export const reducer = (state = initialState, action: actionType): stateType => {
  switch (action.type) {
    case 'todos/TODO_ADD':
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.payload.text,
        },
      ];

    case 'todos/TODO_DELETE':
      return state.filter((todo) => todo.id !== action.payload.id);

    case 'todos/TODO_EDIT':
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo));

    case 'todos/COMPLETE_TODO':
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo));

    case 'todos/COMPLETE_ALL':
      const areAllMarked = state.every((todo) => todo.completed);

      return state.map((todo) => ({
        ...todo,
        completed: !areAllMarked,
      }));

    case 'todos/COMPLETE_CLEAR_COMPLETED':
      return state.filter((todo) => todo.completed === false);

    default:
      return state;
  }
};

export default reducer;
