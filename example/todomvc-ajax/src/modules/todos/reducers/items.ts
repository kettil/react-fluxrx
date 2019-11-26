import { actionType } from '../actions';

export type stateType = Array<{
  text: string;
  completed: boolean;
  id: number;
}>;

const initialState: stateType = [];

export const reducer = (state = initialState, action: actionType): stateType => {
  switch (action.type) {
    case 'TODOS/TODO_ADD':
      return [
        ...state,
        {
          id: action.payload.id || state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: action.payload.completed || false,
          text: action.payload.text,
        },
      ];

    case 'TODOS/TODO_DELETE':
      return state.filter((todo) => todo.id !== action.payload.id);

    case 'TODOS/TODO_EDIT':
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo));

    case 'TODOS/COMPLETE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, completed: action.payload.completed } : todo,
      );

    default:
      return state;
  }
};

export default reducer;
