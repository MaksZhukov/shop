import { useFavoriteStore, favoriteLocalStorage, FavoriteService } from 'entities/favorite';
import { useUserStore } from 'entities/user';
import type { Favorite } from 'entities/favorite';
import { inject } from './favorites.di';

export const useAddFavoriteLogic = () => {
	const favoriteStore = useFavoriteStore();
	const userStore = useUserStore();
	const favoriteService = inject(FavoriteService);

	return async (favorite: Favorite) => {
		if (userStore.id) {
			try {
				let {
					data: { data }
				} = await favoriteService.addFavorite(favorite.product.id, favorite.product.type);
				favoriteStore.addItem(data);
			} catch (err) {
				console.error(err);
				throw err;
			}
		} else {
			favoriteLocalStorage.saveFavorite(favorite);
			favoriteStore.addItem(favorite);
		}
	};
};
