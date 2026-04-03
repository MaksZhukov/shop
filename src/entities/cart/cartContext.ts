import { createContext } from 'react';
import { CartStore } from './cartStore';

export const CartStoreContext = createContext<CartStore | null>(null);
