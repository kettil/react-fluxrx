import React, { Component } from 'react';
import classnames from 'classnames';
import { UnpackedArray } from 'react-fluxrx';

import { stateType as itemsStateType } from '../reducers/items';
import TodoTextInput from './TodoTextInput';

type props = {
  todo: UnpackedArray<itemsStateType>;
  editTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
  completeTodo: (id: number, completed: boolean) => void;
};

export default class TodoItem extends Component<props> {
  state = {
    editing: false,
  };

  handleDoubleClick = () => {
    this.setState({ editing: true });
  };

  handleSave = (id: number, text: string) => {
    if (text.length === 0) {
      this.props.deleteTodo(id);
    } else {
      this.props.editTodo(id, text);
    }
    this.setState({ editing: false });
  };

  render() {
    const { todo, completeTodo, deleteTodo } = this.props;

    let element;
    if (this.state.editing) {
      element = (
        <TodoTextInput
          text={todo.text}
          editing={this.state.editing}
          onSave={(text) => this.handleSave(todo.id, text)}
        />
      );
    } else {
      element = (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => completeTodo(todo.id, !todo.completed)}
          />
          <label onDoubleClick={this.handleDoubleClick}>{todo.text}</label>
          <button className="destroy" onClick={() => deleteTodo(todo.id)} />
        </div>
      );
    }

    return (
      <li
        className={classnames({
          completed: todo.completed,
          editing: this.state.editing,
        })}
      >
        {element}
      </li>
    );
  }
}
