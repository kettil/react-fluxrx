/* tslint:disable:no-console */
import { MiddlewareType } from '../types';

const stylesPre = 'color: #9E9E9E; font-weight: bold';
const stylesMain = 'color: #F20404; font-weight: bold';
const stylesPost = 'color: #4CAF50; font-weight: bold';

const isConsoleGroupDefiend = () =>
  typeof console.groupCollapsed === 'function' &&
  typeof console.groupEnd === 'function' &&
  typeof console.info === 'function';

export const logger = <State>(groupOutput = true): MiddlewareType<State> => {
  return {
    init: (getState, dispatch, updateDirectly) => {
      console.log('init', { state: getState() });
    },

    action: (action, getState, dispatch, reducer) => {
      const { type, payload, ...rest } = action;

      if (groupOutput && isConsoleGroupDefiend()) {
        console.groupCollapsed(`%c Action: %c ${type}`, 'color: gray; font-weight: lighter;', 'color: inherit;');
        console.info('%c prev state', stylesPre, getState());
        console.info('%c action    ', stylesMain, payload, rest);
        console.info('%c next state', stylesPost, reducer(getState(), action));
        console.groupEnd();
      } else {
        console.log('action', type, {
          action,
          prevState: getState(),
          nextState: reducer(getState(), action),
        });
      }

      return action;
    },

    error: (err, dispatch, getState) => {
      try {
        if (groupOutput && err instanceof Error && isConsoleGroupDefiend()) {
          console.groupCollapsed(`%c Error:  %c ${err.message}`, stylesMain, 'color: inherit;');
          console.info('%c state  ', stylesPre, getState());
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
