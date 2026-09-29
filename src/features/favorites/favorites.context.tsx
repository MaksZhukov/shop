import { createContext, type ReactNode } from 'react';
import type { CabinService } from 'entities/cabin';
import type { FavoriteService, FavoriteStore } from 'entities/favorite';
import type { SparePartService } from 'entities/sparePart';
import type { TireService } from 'entities/tire';
import type { UserStore } from 'entities/user';
import type { WheelService } from 'entities/wheel';

export type FavoritesContextValue = {
	cabinService: CabinService;
	favoriteService: FavoriteService;
	sparePartService: SparePartService;
	tireService: TireService;
	wheelService: WheelService;
	userStore: UserStore;
	favoriteStore: FavoriteStore;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesInjectorProps = {
	value: FavoritesContextValue;
	children: ReactNode;
};

export const FavoritesInjector = ({ value, children }: FavoritesInjectorProps) => (
	<FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
);
