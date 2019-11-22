import { DispatchType } from 'react-fluxrx';

import { connect, stateType } from '../../../fluxRx';
import * as todosAction from '../../todos/actions';
import * as todosSelectors from '../../todos/selectors';
import MainSection from '../components/MainSection';

const mapStateToProps = (state: stateType) => {
  return {
    todosCount: state.todos.items.length,
    completedCount: todosSelectors.getCompletedTodoCount(state),
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => ({
  completeAllTodos: () => dispatch(todosAction.completeAllTodos()),
  clearCompleted: () => dispatch(todosAction.clearCompleted()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
