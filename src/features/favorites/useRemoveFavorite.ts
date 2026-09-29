import { favoriteLocalStorage } from 'entities/favorite';
import type { Favorite } from 'entities/favorite';
import { useDI } from './favorites.di';

export const useRemoveFavorite = () => {
	const { favoriteStore, userStore, favoriteService } = useDI();

	return async (favorite: Favorite) => {
		if (userStore.id) {
			await favoriteService.removeFavorite(favorite.id);
		} else {
			favoriteLocalStorage.removeFavorite(favorite);
		}
		favoriteStore.removeItem(favorite.id);
	};
};
