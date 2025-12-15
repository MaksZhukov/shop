import { useFavoriteStore } from 'entities/favorite';
import { useUserStore } from 'entities/user';
import { cabinApi } from 'entities/cabin';
import { sparePartApi } from 'entities/sparePart';
import { tireApi } from 'entities/tire';
import type { ApiResponse } from 'shared/api/types';
import type { CollectionParams } from 'shared/api/types';
import type { Product } from 'entities/product';
import { wheelApi } from 'entities/wheel';
import type { AxiosResponse } from 'axios';
import { favoriteApi } from 'entities/favorite';
import type { Favorite } from 'entities/favorite';
import type { StorageFavorite } from 'entities/favorite';
import { favoriteLocalStorage } from 'entities/favorite';

const getFavoritesByTypes = async (
	favorites: StorageFavorite[],
	fetchFunc: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>
) => {
	let result: { data: Favorite[]; irrelevantFavoriteIDs: number[] } = { data: [], irrelevantFavoriteIDs: [] };
	if (favorites.length) {
		const {
			data: { data }
		} = await fetchFunc({
			filters: { id: favorites.map((item) => item.product.id), sold: false },
			populate: ['images', 'brand']
		});
		result.irrelevantFavoriteIDs = favorites
			.filter((favorite) => !data.some((item) => favorite.product.id === item.id))
			.map((item) => item.id);
		result.data = favorites
			.filter((favorite) => data.some((item) => favorite.product.id === item.id))
			.map((item) => ({
				id: item.id,
				product: data.find((el) => el.id === item.product.id) as Product
			}));
	}
	return result;
};

export const loadFavorites = async (
	favoriteStore: ReturnType<typeof useFavoriteStore>,
	userStore: ReturnType<typeof useUserStore>
) => {
	favoriteStore.setIsLoading(true);
	if (userStore.jwt) {
		const {
			data: { data }
		} = await favoriteApi.fetchFavorites();
		favoriteStore.setItems(data);
	} else {
		const favorites = favoriteLocalStorage.getFavorites();
		try {
			const [
				{ data: spareParts, irrelevantFavoriteIDs: irrelevantFavoritesSparePartIDs },
				{ data: wheels, irrelevantFavoriteIDs: irrelevantFavoritesWheelsIDs },
				{ data: tires, irrelevantFavoriteIDs: irrelevantFavoritesTiresIDs },
				{ data: cabins, irrelevantFavoriteIDs: irrelevantFavoritesCabinsIDs }
			] = await Promise.all([
				getFavoritesByTypes(
					favorites.filter((item) => item.product.type === 'sparePart'),
					sparePartApi.fetchSpareParts
				),
				getFavoritesByTypes(
					favorites.filter((item) => item.product.type === 'wheel'),
					wheelApi.fetchWheels
				),
				getFavoritesByTypes(
					favorites.filter((item) => item.product.type === 'tire'),
					tireApi.fetchTires
				),
				getFavoritesByTypes(
					favorites.filter((item) => item.product.type === 'cabin'),
					cabinApi.fetchCabins
				)
			]);

			favoriteLocalStorage.removeFavorites([
				...irrelevantFavoritesSparePartIDs,
				...irrelevantFavoritesCabinsIDs,
				...irrelevantFavoritesTiresIDs,
				...irrelevantFavoritesWheelsIDs
			]);

			favoriteStore.setItems([...spareParts, ...wheels, ...tires, ...cabins]);
		} catch (err) {
			console.error(err);
		}
	}
	favoriteStore.setIsLoading(false);
};

export const useLoadFavorites = () => {
	const favoriteStore = useFavoriteStore();
	const userStore = useUserStore();
	return () => loadFavorites(favoriteStore, userStore);
};
