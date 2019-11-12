import React from 'react';

import { stateType as itemsStateType } from '../../todos/reducers/visibility';
import FilterLink from '../../todos/containers/Link';

type props = {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

const FILTER_TITLES: Record<itemsStateType['filter'], string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

const Footer = ({ activeCount, completedCount, onClearCompleted }: props) => {
  const itemWord = activeCount === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>

      <ul className="filters">
        {(Object.keys(FILTER_TITLES) as Array<keyof typeof FILTER_TITLES>).map((filter) => (
          <li key={filter}>
            <FilterLink visibility={{ filter }}>{FILTER_TITLES[filter]}</FilterLink>
          </li>
        ))}
      </ul>

      {!!completedCount && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
