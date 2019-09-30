import { combineReducers } from 'react-fluxrx';

import todos from './todos/reducer';

/**
 *
 */
export const reducer = combineReducers({
  todos,
});

export default reducer;

export type stateType = ReturnType<typeof reducer>;
