import React, { FunctionComponent, useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import classnames from 'classnames';

type Props = {
  text?: string;
  editing?: boolean;
  newTodo?: boolean;
  placeholder?: string;
  onSave: (text: string) => void;
};

const TodoInput: FunctionComponent<Props> = ({ text = '', editing, newTodo, placeholder, onSave }) => {
  const [textValue, setTextValue] = useState(text);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      onSave(textValue.trim());

      if (newTodo) {
        setTextValue('');
      }
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setTextValue(e.target.value);
  const handleBlur = (e: FormEvent<HTMLInputElement>) => {
    if (!newTodo) {
      onSave(textValue.trim());
    }
  };

  return (
    <input
      className={classnames({ edit: editing, 'new-todo': newTodo })}
      type="text"
      placeholder={placeholder}
      autoFocus={true}
      value={textValue}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKey}
    />
  );
};

export default TodoInput;
