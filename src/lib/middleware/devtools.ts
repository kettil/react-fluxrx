import { MiddlewareType } from '../types';

export const devTools = <State>(): MiddlewareType<State> => {
  const devToolsObject = typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsObject !== 'function') {
    return {};
  }

  const devToolsInstance = devToolsObject.connect();

  const types = ['JUMP_TO_ACTION', 'JUMP_TO_STATE'];
  let cachedState: State;

  return {
    init: (getState, dispatch, updateDirectly) => {
      cachedState = getState();

      devToolsInstance.init(cachedState);
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

    action: (action, getState, dispatch, reducer) => {
      cachedState = reducer(cachedState, action);

      devToolsInstance.send(action, cachedState);

      return action;
    },
  };
};

export default devTools;
