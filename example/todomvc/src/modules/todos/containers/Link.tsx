import { dispatchType } from 'react-fluxrx';

import { connect, stateType } from '../../../fluxRx';
import { setVisibility } from '../actions';
import { constants } from '../types';

import Link from '../components/Link';

type ownProps = { visibility: constants };

const mapStateToProps = (state: stateType, ownProps: ownProps) => ({
  active: ownProps.visibility === state.todos.visibility,
});

const mapDispatchToProps = (dispatch: dispatchType, ownProps: ownProps) => ({
  setVisibility: () => dispatch(setVisibility(ownProps.visibility)),
});

/**
 *
 */
const LinkConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Link);

export default LinkConnected;
