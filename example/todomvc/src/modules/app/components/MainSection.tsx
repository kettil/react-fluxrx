import React from 'react';

import Footer from './Footer';

import TodoList from '../../todos/containers/TodoList';

type props = {
  todosCount: number;
  completedCount: number;
  completeAllTodos: () => void;
  clearCompleted: () => void;
};

const MainSection = ({ todosCount, completedCount, completeAllTodos, clearCompleted }: props) => {
  return (
    <section className="main">
      {!!todosCount && (
        <span>
          <input className="toggle-all" type="checkbox" checked={completedCount === todosCount} readOnly />
          <label onClick={completeAllTodos}></label>
        </span>
      )}

      <TodoList />

      {!!todosCount && (
        <Footer
          completedCount={completedCount}
          activeCount={todosCount - completedCount}
          onClearCompleted={clearCompleted}
        />
      )}
    </section>
  );
};

export default MainSection;
