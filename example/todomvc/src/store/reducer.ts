import { combineReducers } from 'react-fluxrx';

import todos from '../modules/todos/reducers';

export const reducer = combineReducers({
  todos,
});

export default reducer;
