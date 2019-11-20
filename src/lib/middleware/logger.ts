/* tslint:disable:no-console */
import { middlewareType } from '../types';

const stylesPre = 'color: #9E9E9E; font-weight: bold';
const stylesMain = 'color: #F20404; font-weight: bold';
const stylesPost = 'color: #4CAF50; font-weight: bold';

/**
 *
 */
export const logger = <State>(): middlewareType<State> => {
  return {
    init: (state, dispatch, updateDirectly) => {
      console.log('init', { state });
    },

    action: (action, state, dispatch, reducer) => {
      const { type, payload, ...rest } = action;
      const id = typeof type === 'symbol' ? type.toString() : type;

      try {
        console.groupCollapsed(`%c action %c ${id}`, 'color: gray; font-weight: lighter;', 'color: inherit;');
        console.info('%c prev state', stylesPre, state);
        console.info('%c action    ', stylesMain, id, payload, rest);
        console.info('%c next state', stylesPost, reducer(state, action));
        console.groupEnd();
      } catch (_) {
        console.log('action', action.type, {
          action,
          prevState: state,
          nextState: reducer(state, action),
        });
      }

      return action;
    },

    error: (err, dispatch, state) => {
      try {
        console.groupCollapsed('%c error', stylesMain);
        console.info('%c state  ', stylesPre, state);
        console.info('%c message', stylesMain, err.message);
        console.info('%c stack  ', stylesPost, err.stack);
        console.groupEnd();
      } catch (_) {
        console.error(err);
      }
    },
  };
};

export default logger;
