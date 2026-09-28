import { useFavoriteStore, favoriteLocalStorage, FavoriteService } from 'entities/favorite';
import { useUserStore } from 'entities/user';
import type { Favorite } from 'entities/favorite';
import { inject } from './favorites.di';

export const useRemoveFavorite = () => {
	const favoriteStore = useFavoriteStore();
	const userStore = useUserStore();
	const favoriteService = inject(FavoriteService);

	return async (favorite: Favorite) => {
		if (userStore.id) {
			await favoriteService.removeFavorite(favorite.id);
		} else {
			favoriteLocalStorage.removeFavorite(favorite);
		}
		favoriteStore.removeItem(favorite.id);
	};
};
