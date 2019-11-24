import React from 'react';
import { render } from 'react-dom';
import App from './modules/app/components/App';
import 'todomvc-app-css/index.css';
import fetch from 'isomorphic-unfetch';
import { Provider, store } from './fluxRx';
import * as todoActions from './modules/todos/actions';

render(
  <Provider value={store}>
    {' '}
    <App />{' '}
  </Provider>,
  document.getElementById('root'),
);

fetch('http://localhost:4001/todos', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
  .then((data) => data.json())
  .then((json) => json.forEach((d: any) => store.dispatch(todoActions.insertTodo(d.id, d.text, d.completed))));
