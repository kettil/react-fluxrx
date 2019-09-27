/* tslint:disable:no-console */
import { middlewareType } from '../types';

/**
 *
 */
export const logger = <State>(): middlewareType<State> => {
  return {
    init: (state, dispatch, updateDirectly) => {
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

export default logger;
