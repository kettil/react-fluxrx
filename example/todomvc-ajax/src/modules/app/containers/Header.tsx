import { DispatchType } from 'react-fluxrx';

import { connect } from '../../../fluxRx';
import * as todosAction from '../../todos/actions';
import Header from '../components/Header';

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addTodo: (text: string) => dispatch(todosAction.addTodo(text)),
  };
};

const HeaderConnected = connect(undefined, mapDispatchToProps)(Header);

export default HeaderConnected;
