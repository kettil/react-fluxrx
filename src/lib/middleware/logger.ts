/* tslint:disable:no-console */
import { middlewareType } from '../types';

const stylesPre = 'color: #9E9E9E; font-weight: bold';
const stylesMain = 'color: #F20404; font-weight: bold';
const stylesPost = 'color: #4CAF50; font-weight: bold';

const isConsoleGroupDefiend = () =>
  typeof console.groupCollapsed === 'function' &&
  typeof console.groupEnd === 'function' &&
  typeof console.info === 'function';

export const logger = <State>(groupOutput = true): middlewareType<State> => {
  return {
    init: (state, dispatch, updateDirectly) => {
      console.log('init', { state });
    },

    action: (action, state, dispatch, reducer) => {
      const { type, payload, ...rest } = action;
      const id = typeof type === 'symbol' ? type.toString() : type;

      if (groupOutput && isConsoleGroupDefiend()) {
        console.groupCollapsed(`%c Action: %c ${id}`, 'color: gray; font-weight: lighter;', 'color: inherit;');
        console.info('%c prev state', stylesPre, state);
        console.info('%c action    ', stylesMain, payload, rest);
        console.info('%c next state', stylesPost, reducer(state, action));
        console.groupEnd();
      } else {
        console.log('action', id, {
          action,
          prevState: state,
          nextState: reducer(state, action),
        });
      }

      return action;
    },

    error: (err, dispatch, state) => {
      try {
        if (groupOutput && err instanceof Error && isConsoleGroupDefiend()) {
          console.groupCollapsed(`%c Error:  %c ${err.message}`, stylesMain, 'color: inherit;');
          console.info('%c state  ', stylesPre, state);
          console.info('%c message', stylesMain, err.message);
          console.info('%c stack  ', stylesPost, err.stack);
          console.groupEnd();
        } else {
          console.error(err);
        }
      } catch (err) {
        console.log(err);
      }
    },
  };
};

export default logger;
