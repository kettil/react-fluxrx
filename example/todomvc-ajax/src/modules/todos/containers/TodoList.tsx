import { dispatchType } from 'react-fluxrx';

import { connect, stateType } from '../../../fluxRx';
import * as actions from '../actions';
import { getFilteredTodos } from '../selectors';

import TodoList from '../components/TodoList';

/**
 *
 * @param state
 */
const mapStateToProps = (state: stateType) => ({
  filteredTodos: getFilteredTodos(state),
});

/**
 *
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: dispatchType) => {
  return {
    completeTodo: (id: number, completed: boolean) => dispatch(actions.completeTodo(id, completed)),
    deleteTodo: (id: number) => dispatch(actions.deleteTodo(id)),
    editTodo: (id: number, text: string) => dispatch(actions.editTodo(id, text)),
  };
};

/**
 *
 */
const TodoListConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoList);

export default TodoListConnected;
