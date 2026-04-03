import { FavoriteStore } from 'entities/favorite';
import { FavoriteStoreContext } from 'entities/favorite/favoriteContext';

const favoriteStore = new FavoriteStore();

export const FavoriteStoreProvider = ({ children }: { children: React.ReactNode }) => {
	return <FavoriteStoreContext.Provider value={favoriteStore}>{children}</FavoriteStoreContext.Provider>;
};
