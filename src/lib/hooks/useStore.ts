import { Context, useContext } from 'react';
import { StoreType } from '../types';

export const createStoreHook = <State>(context: Context<StoreType<State>>) => () => useContext(context);
