import { stateType } from '../reducers/visibility';

export const setVisibility = (status: stateType['status']) =>
  ({
    type: 'TODOS/SET_VISIBILITY',
    payload: { status },
  } as const);
