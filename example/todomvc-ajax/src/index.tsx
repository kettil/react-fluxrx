import React from 'react';
import { render } from 'react-dom';
import App from './modules/app/components/App';
import 'todomvc-app-css/index.css';
import fetch from 'isomorphic-unfetch';

import { dispatch } from './fluxRx';
import * as todoActions from './modules/todos/actions';

render(<App />, document.getElementById('root'));

fetch('http://localhost:4001/todos', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
  .then((data) => data.json())
  .then((json) => json.forEach((d: any) => dispatch(todoActions.insertTodo(d.id, d.text, d.completed))));
