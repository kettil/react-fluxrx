import { middlewareType } from '../types';

/**
 *
 */
export const devTools = <State>(): middlewareType<State> => {
  const devToolsObject = typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsObject !== 'function') {
    return {};
  }

  const devToolsInstance = devToolsObject.connect();

  const types = ['JUMP_TO_ACTION', 'JUMP_TO_STATE'];
  let cachedState: State;

  return {
    init: (state, dispatch, updateDirectly) => {
      cachedState = state;

      devToolsInstance.init(state);
      devToolsInstance.subscribe((message: any) => {
        if (message.type && message.payload) {
          switch (message.type) {
            case 'DISPATCH':
              if (message.state && types.indexOf(message.payload.type) >= 0) {
                updateDirectly(JSON.parse(message.state));
              }
              break;

            case 'ACTION':
              dispatch(JSON.parse(message.payload));
          }
        }
      });
    },

    action: (action, state, dispatch, reducer) => {
      cachedState = reducer(cachedState, action);

      devToolsInstance.send(action, cachedState);

      return action;
    },
  };
};

export default devTools;
