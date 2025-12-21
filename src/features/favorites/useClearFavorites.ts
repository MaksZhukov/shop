import { useFavoriteStore, favoriteLocalStorage } from 'entities/favorite';

export const clearFavorites = (favoriteStore: ReturnType<typeof useFavoriteStore>) => {
	let favorites = favoriteLocalStorage.getFavorites();
	favoriteStore.setItems(favoriteStore.items.filter((item) => favorites.some((el) => el.id === item.id)));
};

export const useClearFavorites = () => {
	const favoriteStore = useFavoriteStore();
	return () => clearFavorites(favoriteStore);
};
