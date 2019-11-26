import React, { FunctionComponent, useState, memo } from 'react';
import classnames from 'classnames';
import { UnpackedArray } from 'react-fluxrx';
import { stateType as itemsStateType } from '../../reducers/items';
import TodoTextInput from '../TodoInput';

type Props = {
  todo: UnpackedArray<itemsStateType>;
  editHandler: (id: number, text: string) => void;
  deleteHandler: (id: number) => void;
  completeHandler: (id: number, completed: boolean) => void;
};

export const TodoListItem: FunctionComponent<Props> = ({ completeHandler, deleteHandler, editHandler, todo }) => {
  const [isEditing, setEdititng] = useState(false);

  const save = (text: string) => {
    if (text.length === 0) {
      deleteHandler(todo.id);
    } else {
      editHandler(todo.id, text);
    }
    setEdititng(false);
  };

  let element;
  if (isEditing) {
    element = <TodoTextInput text={todo.text} editing={isEditing} onSave={(text) => save(text)} />;
  } else {
    element = (
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => completeHandler(todo.id, !todo.completed)}
        />
        <label onDoubleClick={() => setEdititng(true)}>{todo.text}</label>
        <button className="destroy" onClick={() => deleteHandler(todo.id)} />
      </div>
    );
  }

  return <li className={classnames({ completed: todo.completed, editing: isEditing })}>{element}</li>;
};

export default memo(TodoListItem);
