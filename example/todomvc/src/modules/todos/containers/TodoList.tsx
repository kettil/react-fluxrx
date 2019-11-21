import { dispatchType, bindActions } from 'react-fluxrx';

import { connect, stateType } from '../../../fluxRx';
import * as actions from '../actions';
import { getFilteredTodos } from '../selectors';
import TodoList from '../components/TodoList';

const mapStateToProps = (state: stateType) => ({
  filteredTodos: getFilteredTodos(state),
});

const mapDispatchToProps = (dispatch: dispatchType) => {
  return bindActions(actions, dispatch);
};

const TodoListConnected = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default TodoListConnected;
