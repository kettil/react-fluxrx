import { actionType, reducersType } from './libs/types';

import { errorNewStateIsUndefined, errorReducerIsNotAFunction, errorReducerIsNotInitialized } from './libs/reducers';

/**
 *
 * @param reducers
 */
export default function combineReducersFactory(checkedReducers: (reducers: reducersType<any>) => reducersType<any>) {
  return <S>(reducers: reducersType<any>) => {
    const reducerList = checkedReducers(reducers);
    const reducerKeys = Object.keys(reducerList);

    return (state: S, action: actionType): S => {
      const nextState: { [key: string]: any } = {};
      let hasChange = false;

      for (const key of reducerKeys) {
        const reducer = reducerList[key];
        const oldSubState: any = state[key as keyof S];
        const newSubState = reducer(oldSubState, action);

        if (typeof newSubState === 'undefined') {
          throw new Error(errorNewStateIsUndefined(key, action));
        }

        nextState[key] = newSubState;
        hasChange = hasChange || oldSubState !== newSubState;
      }
      return hasChange ? (nextState as S) : state;
    };
  };
}

/**
 *
 * @param reducers
 */
export function checkedReducers<S>(reducers: reducersType<S>): reducersType<S> {
  const items: reducersType<S> = {};
  const keys = Object.keys(reducers);

  for (const key of keys) {
    const reducer = reducers[key];

    if (typeof reducer === 'function') {
      const init = reducer(undefined, { type: '', payload: '' });
      // whether the reducer returns an initialized value
      if (typeof init === 'undefined') {
        throw new Error(errorReducerIsNotInitialized(key));
      }
      // add to list
      items[key] = reducer;
    } else {
      throw new Error(errorReducerIsNotAFunction(key));
    }
  }

  return items;
}
