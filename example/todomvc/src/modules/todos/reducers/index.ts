import { combineReducers } from 'react-fluxrx';
import items, { StateTodosItemsType } from './items';
import visibility, { StateTodosVisibilityType } from './visibility';

export type StateTodosType = {
  items: StateTodosItemsType;
  visibility: StateTodosVisibilityType;
};

export const reducer = combineReducers<StateTodosType>({
  items,
  visibility,
});

export default reducer;
