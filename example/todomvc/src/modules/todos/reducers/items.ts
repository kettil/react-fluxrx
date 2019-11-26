import { actionType } from '../actions';

export type stateType = Array<{
  text: string;
  completed: boolean;
  id: number;
}>;

const initialState: stateType = [
  {
    id: 0,
    text: 'Use react-fluxRx',
    completed: false,
  },
];

export const reducer = (state = initialState, action: actionType): stateType => {
  switch (action.type) {
    case 'TODOS/TODO_ADD':
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.payload.text,
        },
      ];

    case 'TODOS/TODO_DELETE':
      return state.filter((todo) => todo.id !== action.payload.id);

    case 'TODOS/TODO_EDIT':
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo));

    case 'TODOS/COMPLETE_TODO':
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo));

    case 'TODOS/COMPLETE_ALL':
      const areAllMarked = state.every((todo) => todo.completed);

      return state.map((todo) => ({
        ...todo,
        completed: !areAllMarked,
      }));

    case 'TODOS/COMPLETE_CLEAR_COMPLETED':
      return state.filter((todo) => todo.completed === false);

    default:
      return state;
  }
};

export default reducer;
