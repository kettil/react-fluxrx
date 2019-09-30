import React, { Component } from 'react';
import classnames from 'classnames';

type props = {
  text?: string;
  editing?: boolean;
  newTodo?: boolean;
  placeholder?: string;
  onSave: (text: string) => void;
};

export default class TodoTextInput extends Component<props> {
  state = {
    text: this.props.text || '',
  };

  handleSubmit = (e: any) => {
    const text = e.target.value.trim();
    if (e.which === 13) {
      this.props.onSave(text);

      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  };

  handleChange = (e: any) => {
    this.setState({ text: e.target.value });
  };

  handleBlur = (e: any) => {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value);
    }
  };

  render() {
    return (
      <input
        className={classnames({
          edit: this.props.editing,
          'new-todo': this.props.newTodo,
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus={true}
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
