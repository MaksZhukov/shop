import { fetchCabins } from 'api/cabins/cabins';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchTires } from 'api/tires/tires';
import { ApiResponse, CollectionParams, Product } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import {
	StorageFavorite,
	getFavorites,
	removeFavorite as removeFavoriteLS,
	removeFavorites as removeFavoritesLS,
	saveFavorite
} from 'services/LocalStorageService';
import RootStore from '.';
import { addFavorite, fetchFavorites, removeFavorite, removeFavorites } from '../api/favorites/favorites';
import { Favorite } from '../api/favorites/types';

export interface Favorites {
	items: Favorite[];
	isLoading: boolean;
}

export default class FavoritesStore implements Favorites {
	root: RootStore;
	items: Favorite[] = [];
	isLoading: boolean = false;

	constructor(root: RootStore) {
		this.root = root;
		makeAutoObservable(this);
	}
	async loadFavorites() {
		this.isLoading = true;
		if (this.root.user.jwt) {
			const {
				data: { data }
			} = await fetchFavorites();
			runInAction(() => {
				this.items = data;
			});
		} else {
			const favorites = getFavorites();
			try {
				const [
					{ data: spareParts, irrelevantFavoriteIDs: irrelevantFavoritesSparePartIDs },
					{ data: wheels, irrelevantFavoriteIDs: irrelevantFavoritesWheelsIDs },
					{ data: tires, irrelevantFavoriteIDs: irrelevantFavoritesTiresIDs },
					{ data: cabins, irrelevantFavoriteIDs: irrelevantFavoritesCabinsIDs }
				] = await Promise.all([
					this.getFavoritesByTypes(
						favorites.filter((item) => item.product.type === 'sparePart'),
						fetchSpareParts
					),
					this.getFavoritesByTypes(
						favorites.filter((item) => item.product.type === 'wheel'),
						fetchWheels
					),
					this.getFavoritesByTypes(
						favorites.filter((item) => item.product.type === 'tire'),
						fetchTires
					),
					this.getFavoritesByTypes(
						favorites.filter((item) => item.product.type === 'cabin'),
						fetchCabins
					)
				]);

				removeFavoritesLS([
					...irrelevantFavoritesSparePartIDs,
					...irrelevantFavoritesCabinsIDs,
					...irrelevantFavoritesTiresIDs,
					...irrelevantFavoritesWheelsIDs
				]);

				runInAction(() => {
					this.items = [...spareParts, ...wheels, ...tires, ...cabins];
				});
			} catch (err) {
				console.error(err);
			}
		}
		this.isLoading = false;
	}
	async getFavoritesByTypes(
		favorites: StorageFavorite[],
		fetchFunc: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>
	) {
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
					...item,
					product: data.find((el) => el.id === item.product.id) as Product
				}));
		}
		return result;
	}
	async addFavorite(favorite: Favorite) {
		if (this.root.user.id) {
			try {
				let {
					data: { data }
				} = await addFavorite(favorite.product.id, favorite.product.type);
				runInAction(() => {
					this.items.push(data);
				});
			} catch (err) {
				console.error(err);
			}
		} else {
			saveFavorite(favorite);
			runInAction(() => {
				this.items.push(favorite);
			});
		}
	}
	async removeFavorite(favorite: Favorite) {
		if (this.root.user.id) {
			await removeFavorite(favorite.id);
		} else {
			removeFavoriteLS(favorite);
		}
		runInAction(() => {
			this.items = this.items.filter((el) => el.id !== favorite.id);
		});
	}
	async removeFavorites(favoritesIDs: number[]) {
		debugger;
		if (this.root.user.id) {
			await removeFavorites(favoritesIDs);
		} else {
			removeFavoritesLS(favoritesIDs);
		}
		runInAction(() => {
			this.items = this.items.filter((el) => !favoritesIDs.includes(el.id));
		});
	}

	clearFavorites() {
		let favorites = getFavorites();
		this.items = this.items.filter((item) => favorites.filter((el) => el.id === item.id));
	}
}
