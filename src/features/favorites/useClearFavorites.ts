import { favoriteLocalStorage, type FavoriteStore } from 'entities/favorite';
import { useDI } from './favorites.di';

export const clearFavorites = (favoriteStore: FavoriteStore) => {
	let favorites = favoriteLocalStorage.getFavorites();
	favoriteStore.setItems(favoriteStore.items.filter((item) => favorites.some((el) => el.id === item.id)));
};

export const useClearFavorites = () => {
	const { favoriteStore } = useDI();
	return () => clearFavorites(favoriteStore);
};
