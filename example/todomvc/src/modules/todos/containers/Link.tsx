import { dispatchType } from 'react-fluxrx';

import { connect, stateType } from '../../../fluxRx';
import { setVisibility } from '../actions';
import { stateType as visibilityStateType } from '../reducers/visibility';
import Link from '../components/Link';

type ownProps = { visibility: visibilityStateType };

const mapStateToProps = (state: stateType, ownProps: ownProps) => ({
  active: ownProps.visibility.filter === state.todos.visibility.filter,
});

const mapDispatchToProps = (dispatch: dispatchType, ownProps: ownProps) => ({
  setVisibility: () => dispatch(setVisibility(ownProps.visibility.filter)),
});

const LinkConnected = connect(mapStateToProps, mapDispatchToProps)(Link);

export default LinkConnected;
