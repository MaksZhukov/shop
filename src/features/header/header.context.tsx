import { createContext, type ReactNode } from 'react';
import type { CartStore } from 'entities/cart';
import type { FavoriteStore } from 'entities/favorite';
import type { UserStore } from 'entities/user';
import type { HeaderStore } from './header.store';
import type { HeaderCatalogStore } from './catalogMenu/headerCatalog.store';
import type { HeaderSearchStore } from './search/headerSearch.store';
import type { UserMenuStore } from './userMenu/userMenu.store';

export type HeaderContextValue = {
	headerStore: HeaderStore;
	headerSearchStore: HeaderSearchStore;
	headerCatalogStore: HeaderCatalogStore;
	userMenuStore: UserMenuStore;
	userStore: UserStore;
	cartStore: CartStore;
	favoriteStore: FavoriteStore;
};

export const HeaderContext = createContext<HeaderContextValue | null>(null);

type HeaderInjectorProps = {
	value: HeaderContextValue;
	children: ReactNode;
};

export const HeaderInjector = ({ value, children }: HeaderInjectorProps) => (
	<HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
);
