import { useFavoriteStore, favoriteLocalStorage, FavoriteService } from 'entities/favorite';
import { useUserStore } from 'entities/user';
import { CabinService } from 'entities/cabin';
import { SparePartService } from 'entities/sparePart';
import { TireService } from 'entities/tire';
import type { ApiResponse } from 'shared/api/types';
import type { CollectionParams } from 'shared/api/types';
import type { Product } from 'entities/product';
import { WheelService } from 'entities/wheel';
import type { AxiosResponse } from 'axios';
import type { Favorite, StorageFavorite } from 'entities/favorite';
import { useCallback } from 'react';
import { inject } from './favorites.di';

type FavoriteLoadServices = {
	favoriteService: FavoriteService;
	sparePartService: SparePartService;
	wheelService: WheelService;
	tireService: TireService;
	cabinService: CabinService;
};

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
	userStore: ReturnType<typeof useUserStore>,
	services: FavoriteLoadServices
) => {
	favoriteStore.setIsLoading(true);
	if (userStore.id) {
		const {
			data: { data }
		} = await services.favoriteService.fetchFavorites();
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
					(params) => services.sparePartService.fetchSpareParts(params)
				),
				getFavoritesByTypes(
					favorites.filter((item) => item.product.type === 'wheel'),
					(params) => services.wheelService.fetchWheels(params)
				),
				getFavoritesByTypes(
					favorites.filter((item) => item.product.type === 'tire'),
					(params) => services.tireService.fetchTires(params)
				),
				getFavoritesByTypes(
					favorites.filter((item) => item.product.type === 'cabin'),
					(params) => services.cabinService.fetchCabins(params)
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
	const favoriteService = inject(FavoriteService);
	const sparePartService = inject(SparePartService);
	const wheelService = inject(WheelService);
	const tireService = inject(TireService);
	const cabinService = inject(CabinService);
	return useCallback(
		() =>
			loadFavorites(favoriteStore, userStore, {
				favoriteService,
				sparePartService,
				wheelService,
				tireService,
				cabinService
			}),
		[favoriteStore, userStore, favoriteService, sparePartService, wheelService, tireService, cabinService]
	);
};
