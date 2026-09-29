import { favoriteLocalStorage } from 'entities/favorite';
import type { Favorite } from 'entities/favorite';
import { useDI } from './favorites.di';

export const useAddFavoriteLogic = () => {
	const { favoriteStore, userStore, favoriteService } = useDI();

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
