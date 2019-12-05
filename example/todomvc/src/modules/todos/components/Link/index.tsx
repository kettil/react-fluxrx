import { useDispatch, useSelector } from '../../../../store';
import { setVisibility } from '../../actions';
import { StateTodosVisibilityType } from '../../reducers/visibility';
import Link, { Props } from './Link';
import { getTodosVisibility } from '../../selectors';
import React, { FunctionComponent, useCallback } from 'react';
import { hocOptimize } from 'react-fluxrx';

type HocProps = { visibility: StateTodosVisibilityType['status'] };

const hocLink = (Component: FunctionComponent<Props>): FunctionComponent<HocProps> => {
  const Wrapper: FunctionComponent<HocProps> = ({ visibility, ...props }) => {
    const active = useSelector(
      useCallback((state) => visibility === getTodosVisibility(state), [visibility]),
      [visibility],
    );
    const action = useDispatch(setVisibility);
    const clickHandler = useCallback(() => action(visibility), [action, visibility]);

    return <Component active={active} clickHandler={clickHandler} {...props} />;
  };

  return hocOptimize(Component, Wrapper);
};

export default hocLink(Link);
