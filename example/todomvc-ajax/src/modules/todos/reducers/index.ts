import { combineReducers } from 'react-fluxrx';
import items from './items';
import visibility from './visibility';

export const reducer = combineReducers({
  items,
  visibility,
});

export default reducer;
