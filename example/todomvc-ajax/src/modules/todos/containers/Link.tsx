import { ReactNode } from 'react';

import { dispatchType } from 'react-fluxrx';

import { connect, stateType } from '../../../fluxRx';
import { setVisibility } from '../actions';
import { constants } from '../types';

import Link from '../components/Link';

type ownProps = { visibility: constants; readonly children: ReactNode };

/**
 *
 * @param state
 * @param ownProps
 */
const mapStateToProps = (state: stateType, ownProps: ownProps) => ({
  active: ownProps.visibility === state.todos.visibility,
});

/**
 *
 * @param dispatch
 * @param ownProps
 */
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
