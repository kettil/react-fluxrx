import { actionTodosItemType, actionTypes, actionTodosVisibilityType, constants, stateTodosItemsType } from './types';

/**
 *
 * @param text
 */
export const loadTodo = (id: number, text: string, completed: boolean): actionTodosItemType => {
  return {
    type: actionTypes.TODO_ADD,
    payload: {
      id,
      text,
      completed,
    },
  };
};

/**
 *
 * @param text
 */
export const addTodo = (text: string): actionTodosItemType => {
  return {
    type: 'loading',
    payload: {},

    ajaxMethod: 'POST',
    ajaxUrlPath: '/todos',
    ajaxData: { text, completed: false },
    ajaxResponse: (data: any) => loadTodo(data.id, data.text, data.completed),
  };
};

/**
 *
 * @param id
 */
export const deleteTodo = (id: number): actionTodosItemType => ({
  type: actionTypes.TODO_DELETE,
  payload: { id },

  ajaxMethod: 'DELETE',
  ajaxUrlPath: '/todos/' + id,
});

/**
 *
 * @param id
 * @param text
 */
export const editTodo = (id: number, text: string): actionTodosItemType => ({
  type: actionTypes.TODO_EDIT,
  payload: { id, text },

  ajaxMethod: 'PATCH',
  ajaxUrlPath: '/todos/' + id,
  ajaxData: { text },
});

/**
 *
 * @param id
 */
export const completeTodo = (id: number, completed: boolean): actionTodosItemType => ({
  type: actionTypes.COMPLETE_TODO,
  payload: { id, completed },

  ajaxMethod: 'PATCH',
  ajaxUrlPath: '/todos/' + id,
  ajaxData: { completed },
});

/**
 *
 */
export const completeAllTodos = (): actionTodosItemType => ({
  type: 'loading',
  payload: {},

  ajaxMethod: 'GET',
  ajaxUrlPath: '/todos',

  ajaxResponse: (data: any) => {
    const todos: stateTodosItemsType = data;
    const areAllMarked = todos.every((todo) => todo.completed);

    return todos.map((todo) => completeTodo(todo.id, !areAllMarked));
  },
});

/**
 *
 */
export const clearCompleted = (): actionTodosItemType => ({
  type: 'loading',
  payload: {},

  ajaxMethod: 'GET',
  ajaxUrlPath: '/todos?completed=true',
  ajaxResponse: (data: any) => {
    const todos: stateTodosItemsType = data;

    return todos.map((d) => deleteTodo(d.id));
  },
});

/**
 *
 * @param filter
 */
export const setVisibility = (filter: constants): actionTodosVisibilityType => ({
  type: actionTypes.SET_VISIBILITY,
  payload: filter,
});
