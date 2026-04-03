import { createContext } from 'react';
import { FavoriteStore } from './favoriteStore';

export const FavoriteStoreContext = createContext<FavoriteStore | null>(null);
