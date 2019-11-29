import { hocOptimize } from 'react-fluxrx';
import { useDispatch, useSelector } from '../../../../store';
import MainSection, { Props } from './MainSection';
import React, { FunctionComponent } from 'react';
import { completeAllTodos, clearCompleted } from '../../../todos/actions';
import { getTodosAndCompletedCount } from '../../../todos/selectors';

const hocMainSection = (Component: FunctionComponent<Props>): FunctionComponent<{}> => {
  const Wrapper: FunctionComponent<{}> = (props) => {
    const state = useSelector((state) => getTodosAndCompletedCount(state, true));
    const handleCompleteAll = useDispatch(completeAllTodos);
    const handleClearCompleted = useDispatch(clearCompleted);

    return (
      <Component {...props} {...state} clearCompleted={handleClearCompleted} completeAllTodos={handleCompleteAll} />
    );
  };

  return hocOptimize(Component, Wrapper);
};

export default hocMainSection(MainSection);
