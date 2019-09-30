import React from 'react';
import { render } from 'react-dom';
import App from './modules/app/components/App';
import 'todomvc-app-css/index.css';

import { Provider, store } from './fluxRx';

render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
