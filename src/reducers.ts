import { reducersType, actionType } from './utils/types';
import { log } from './utils/various';
import {
  errorNewStateIsUndefined,
  errorReducerIsNotAFunction,
  errorReducerIsNotInitialized,
} from './utils/reducers';

/**
 *
 * @param reducers
 */
export default function combineReducers<S>(reducers: reducersType<any>) {
  const reducerList = checkedReducers<any>(reducers);
  const reducerKeys = Object.keys(reducerList);

  return (state: S, action: actionType): S => {
    const nextState: { [key: string]: any } = {};
    let hasChange = false;

    for (let key of reducerKeys) {
      const reducer = reducerList[key];
      const oldSubState: any = state[<keyof S>key];
      const newSubState = reducer(oldSubState, action);

      if (typeof newSubState === 'undefined') {
        throw new Error(errorNewStateIsUndefined(key, action));
      }

      nextState[key] = newSubState;
      hasChange = hasChange || oldSubState !== newSubState;
    }
    return hasChange ? <S>nextState : state;
  };
}

/**
 *
 * @param reducers
 */
export function checkedReducers<S>(reducers: reducersType<S>): reducersType<S> {
  const items: reducersType<S> = {};
  const keys = Object.keys(reducers);

  for (let key of keys) {
    const reducer = reducers[key];

    if (typeof reducer === 'function') {
      const init = reducer(undefined, { type: '', payload: '' });

      // whether the reducer returns an initialized value
      if (typeof init === 'undefined') {
        throw new Error(errorReducerIsNotInitialized(key));
      }

      // add list
      items[key] = reducer;
    } else {
      log(errorReducerIsNotAFunction(key), true);
    }
  }

  return items;
}
