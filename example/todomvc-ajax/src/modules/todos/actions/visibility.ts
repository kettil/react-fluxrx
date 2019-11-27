import { StateTodosVisibilityType } from '../reducers/visibility';
// For the action debugging
//import { ActionType } from '../../../store';

export const setVisibility = (status: StateTodosVisibilityType['status']) =>
  ({
    type: 'TODOS/SET_VISIBILITY',
    payload: { status },
  } as const);
