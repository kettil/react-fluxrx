import { FunctionComponent, memo } from 'react';

export const hocOptimize = <C, W>(Component: FunctionComponent<C>, Wrapper: FunctionComponent<W>) => {
  const displayName = Component.displayName || Component.name;

  // istanbul ignore else
  if (displayName) {
    Wrapper.displayName = displayName;
  }

  return memo(Wrapper);
};
