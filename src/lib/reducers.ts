import { ActionType, ReducersType, ReducerType } from './types';

/**
 *
 * @param reducers
 */
export const combineReducers = <State>(reducers: ReducersType<State>): ReducerType<State> => {
  checkedReducers(reducers);

  return (state: State | undefined, action: ActionType<State>): State => {
    const nextState: { [K in keyof State]?: State[K] } = {};
    let hasChange = false;

    (Object.keys(reducers) as Array<keyof State>).forEach((key) => {
      const reducer = reducers[key];
      const oldSubState = state && state[key];
      const newSubState = reducer(oldSubState, action);

      if (typeof newSubState === 'undefined') {
        const type = typeof action.type === 'symbol' ? action.type.toString() : action.type;

        throw new Error(`Action "${type}" from Reducer "${key}" returns an undefined value`);
      }

      nextState[key] = newSubState;
      hasChange = hasChange || oldSubState !== newSubState;
    });

    return (hasChange ? nextState : state) as State;
  };
};

/**
 *
 * @param reducers
 */
export function checkedReducers<State>(reducers: ReducersType<State>) {
  (Object.keys(reducers) as Array<keyof State>).forEach((key) => {
    const reducer = reducers[key];

    if (typeof reducer !== 'function') {
      throw new Error(`No reducer function provided for key "${key}"`);
    }

    const init = reducer(undefined, { type: '', payload: '' });

    // whether the reducer returns an initialized value
    if (typeof init === 'undefined') {
      throw new Error(`Reducer "${key}" did not return an initialized state`);
    }
  });
}
