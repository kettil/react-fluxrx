import React, { PropsWithChildren, FunctionComponent } from 'react';
import classnames from 'classnames';

export type Props = PropsWithChildren<{
  readonly active: boolean;
  readonly clickHandler: () => void;
}>;

const Link: FunctionComponent<Props> = ({ active, children, clickHandler }) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <a className={classnames({ selected: active })} style={{ cursor: 'pointer' }} onClick={clickHandler}>
    {children}
  </a>
);

export default Link;
