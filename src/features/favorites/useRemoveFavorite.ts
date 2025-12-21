import { useFavoriteStore } from 'entities/favorite';
import { useUserStore } from 'entities/user';
import { favoriteApi } from 'entities/favorite';
import type { Favorite } from 'entities/favorite';
import { favoriteLocalStorage } from 'entities/favorite';

export const useRemoveFavorite = () => {
	const favoriteStore = useFavoriteStore();
	const userStore = useUserStore();

	return async (favorite: Favorite) => {
		if (userStore.id) {
			await favoriteApi.removeFavorite(favorite.id);
		} else {
			favoriteLocalStorage.removeFavorite(favorite);
		}
		favoriteStore.removeItem(favorite.id);
	};
};
