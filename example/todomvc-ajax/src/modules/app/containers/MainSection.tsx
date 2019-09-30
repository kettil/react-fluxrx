import { dispatchType } from 'react-fluxrx';

import { connect, stateType } from '../../../fluxRx';
import { todosAction, todosSelectors } from '../../todos';

import MainSection from '../components/MainSection';

/**
 *
 * @param state
 */
const mapStateToProps = (state: stateType) => {
  return {
    todosCount: state.todos.items.length,
    completedCount: todosSelectors.getCompletedTodoCount(state),
  };
};

/**
 *
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: dispatchType) => ({
  completeAllTodos: () => dispatch(todosAction.completeAllTodos()),
  clearCompleted: () => dispatch(todosAction.clearCompleted()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainSection);
