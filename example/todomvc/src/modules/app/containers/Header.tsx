import { dispatchType } from 'react-fluxrx';

import { connect } from '../../../fluxRx';
import { todosAction } from '../../todos';

import Header from '../components/Header';

/**
 *
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: dispatchType) => {
  return {
    addTodo: (text: string) => dispatch(todosAction.addTodo(text)),
  };
};

const HeaderConnected = connect(
  undefined,
  mapDispatchToProps,
)(Header);

export default HeaderConnected;