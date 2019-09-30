import { actionTodosItemType, actionTypes, actionTodosVisibilityType, constants } from './types';

/**
 *
 * @param text
 */
export const addTodo = (text: string): actionTodosItemType => {
  return {
    type: actionTypes.TODO_ADD,
    payload: { text },
  };
};

/**
 *
 * @param id
 */
export const deleteTodo = (id: number): actionTodosItemType => ({
  type: actionTypes.TODO_DELETE,
  payload: { id },
});

/**
 *
 * @param id
 * @param text
 */
export const editTodo = (id: number, text: string): actionTodosItemType => ({
  type: actionTypes.TODO_EDIT,
  payload: { id, text },
});

/**
 *
 * @param id
 */
export const completeTodo = (id: number): actionTodosItemType => ({
  type: actionTypes.COMPLETE_TODO,
  payload: { id },
});

/**
 *
 */
export const completeAllTodos = (): actionTodosItemType => ({
  type: actionTypes.COMPLETE_ALL,
  payload: {},
});

/**
 *
 */
export const clearCompleted = (): actionTodosItemType => ({
  type: actionTypes.COMPLETE_CLEAR_COMPLETED,
  payload: {},
});

/**
 *
 * @param filter
 */
export const setVisibility = (filter: constants): actionTodosVisibilityType => ({
  type: actionTypes.SET_VISIBILITY,
  payload: filter,
});
