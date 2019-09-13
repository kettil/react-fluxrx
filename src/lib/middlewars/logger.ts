/* tslint:disable:no-console */
import { middlewareType } from '../types';

/**
 *
 * @param action
 * @param store
 * @param reducer
 * @param setState
 */
export const devTools = <State>(): middlewareType<State> => {
  return {
    init: (state, dispatch, setState, updateDirectly) => {
      console.log('init', { state });
    },

    action: (action, state, dispatch, reducer) => {
      console.log('action', {
        action,
        prevState: state,
        nextState: reducer(state, action),
      });

      return action;
    },

    error: (err, dispatch, state) => {
      console.error(err);
    },
  };
};

export default devTools;
