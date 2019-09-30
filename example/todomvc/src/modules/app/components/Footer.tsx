import React from 'react';

import { todosConstants } from '../../todos';
import FilterLink from '../../todos/containers/Link';

type props = {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

const FILTER_TITLES = {
  [todosConstants.SHOW_ALL]: 'All',
  [todosConstants.SHOW_ACTIVE]: 'Active',
  [todosConstants.SHOW_COMPLETED]: 'Completed',
};

const Footer = ({ activeCount, completedCount, onClearCompleted }: props) => {
  const itemWord = activeCount === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>

      <ul className="filters">
        {Object.keys(FILTER_TITLES).map((filter) => (
          <li key={filter}>
            <FilterLink visibility={filter as keyof typeof FILTER_TITLES}>
              {FILTER_TITLES[filter as keyof typeof FILTER_TITLES]}
            </FilterLink>
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
