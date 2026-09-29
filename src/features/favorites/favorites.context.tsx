import { createContext, type ReactNode } from 'react';
import type { FavoriteStore } from 'entities/favorite';
import type { FavoriteListService } from './favoriteList.service';

export type FavoritesContextValue = {
	favoriteStore: FavoriteStore;
	favoriteListService: FavoriteListService;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesInjectorProps = {
	value: FavoritesContextValue;
	children: ReactNode;
};

export const FavoritesInjector = ({ value, children }: FavoritesInjectorProps) => (
	<FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
);
