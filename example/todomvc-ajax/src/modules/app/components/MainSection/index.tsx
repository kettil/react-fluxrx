import { memo } from 'react-fluxrx';
import { useDispatch, useSelector } from '../../../../store';
import MainSection, { Props } from './MainSection';
import React, { FunctionComponent } from 'react';
import { completeAllTodos, clearCompleted } from '../../../todos/actions';
import { getTodosAndCompletedCount } from '../../../todos/selectors';

const hocMainSection = (Component: FunctionComponent<Props>): FunctionComponent<{}> => {
  const Wrapper: FunctionComponent<{}> = (props) => {
    const state = useSelector(getTodosAndCompletedCount);
    const handleCompleteAll = useDispatch(completeAllTodos);
    const handleClearCompleted = useDispatch(clearCompleted);

    return (
      <Component {...props} {...state} clearCompleted={handleClearCompleted} completeAllTodos={handleCompleteAll} />
    );
  };

  return memo(Component, Wrapper);
};

export default hocMainSection(MainSection);
