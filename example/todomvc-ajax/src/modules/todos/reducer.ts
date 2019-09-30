import { combineReducers } from 'react-fluxrx';

import items from './reducers/items';
import visibility from './reducers/visibility';

import { stateTodosType } from './types';

/**
 *
 */
export const reducer = combineReducers<stateTodosType>({
  items,
  visibility,
});

/**
 *
 */
export default reducer;
