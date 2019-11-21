import React, { PropsWithChildren, FC } from 'react';
import classnames from 'classnames';

type Props = PropsWithChildren<{
  readonly active: boolean;
  readonly setVisibility: () => void;
}>;

const Link: FC<Props> = ({ active, children, setVisibility }) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <a className={classnames({ selected: active })} style={{ cursor: 'pointer' }} onClick={setVisibility}>
    {children}
  </a>
);

export default Link;
