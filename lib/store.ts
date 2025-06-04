import type { Store } from '@livestore/livestore';
import { createContext, useContext } from 'react';
import { schema } from './livestore';

export const StoreContext = createContext<Store<typeof schema> | null>(null);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('Store not found. Make sure you are using useStore within a StoreProvider.');
  }
  return store;
}; 