import { useFavoriteStore } from 'entities/favorite';
import { useUserStore } from 'entities/user';
import { favoriteApi } from 'entities/favorite';
import type { Favorite } from 'entities/favorite';
import { favoriteLocalStorage } from 'entities/favorite';

export const useAddFavoriteLogic = () => {
	const favoriteStore = useFavoriteStore();
	const userStore = useUserStore();

	return async (favorite: Favorite) => {
		if (userStore.id) {
			try {
				let {
					data: { data }
				} = await favoriteApi.addFavorite(favorite.product.id, favorite.product.type);
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
