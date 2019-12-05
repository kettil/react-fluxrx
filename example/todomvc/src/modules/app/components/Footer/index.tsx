import React from 'react';
import { StateTodosVisibilityType } from '../../../todos/reducers/visibility';
import FilterLink from '../../../todos/components/Link';

type Props = {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

const FILTER_TITLES: Record<StateTodosVisibilityType['status'], string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

const Footer = ({ activeCount, completedCount, onClearCompleted }: Props) => {
  const itemWord = activeCount === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>

      <ul className="filters">
        {(Object.keys(FILTER_TITLES) as Array<keyof typeof FILTER_TITLES>).map((filter) => (
          <li key={filter}>
            <FilterLink visibility={filter}>{FILTER_TITLES[filter]}</FilterLink>
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
