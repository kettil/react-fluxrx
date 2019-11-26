import React, { FunctionComponent } from 'react';

export const memo = <C, W>(Component: FunctionComponent<C>, Wrapper: FunctionComponent<W>) => {
  const displayName = Component.displayName || Component.name;

  // istanbul ignore else
  if (displayName) {
    Wrapper.displayName = displayName;
  }

  return React.memo(Wrapper);
};
