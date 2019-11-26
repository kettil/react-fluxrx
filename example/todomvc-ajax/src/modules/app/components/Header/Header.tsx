import React from 'react';
import TodoTextInput from '../../../todos/components/TodoInput';

export type Props = {
  addTodo: (text: string) => void;
};

const Header = ({ addTodo }: Props) => (
  <header className="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={(text: string) => {
        if (text.length !== 0) {
          addTodo(text);
        }
      }}
      placeholder="What needs to be done?"
    />
  </header>
);

export default Header;
