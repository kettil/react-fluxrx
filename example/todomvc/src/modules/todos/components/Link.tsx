import React, { ReactNode } from 'react';
import classnames from 'classnames';

type props = {
  active: boolean;
  children: ReactNode;
  setVisibility: () => void;
};

const Link = ({ active, children, setVisibility }: props) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <a className={classnames({ selected: active })} style={{ cursor: 'pointer' }} onClick={() => setVisibility()}>
    {children}
  </a>
);

export default Link;
