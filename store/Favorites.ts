import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchTiers } from 'api/tires/tires';
import { ApiResponse, CollectionParams, Product } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import {
	FavoriteLocalStorage,
	getFavoriteProductIDs,
	removeFavoriteProductID,
	saveFavoriteProductID,
} from 'services/LocalStorageService';
import RootStore from '.';
import {
	removeFavorite,
	addFavorite,
	fetchFavorites,
} from '../api/favorites/favorites';
import { Favorite } from '../api/favorites/types';

export interface Favorites {
	items: Favorite[];
}

export default class FavoritesStore implements Favorites {
	root: RootStore;
	items: Favorite[] = [];

	constructor(root: RootStore) {
		this.root = root;
		makeAutoObservable(this);
	}
	async loadFavorites() {
		if (this.root.user.jwt) {
			const {
				data: { data },
			} = await fetchFavorites();
			this.items = data;
		} else {
			const favoriteProductIDs = getFavoriteProductIDs();
			try {
				const [spareParts, wheels, tires] = await Promise.all([
					this.getFavoritesByTypes(
						favoriteProductIDs.sparePart,
						fetchSpareParts
					),
					this.getFavoritesByTypes(
						favoriteProductIDs.wheel,
						fetchWheels
					),
					this.getFavoritesByTypes(
						favoriteProductIDs.tire,
						fetchTiers
					),
				]);

				this.items = [...spareParts, ...wheels, ...tires].map(
					(item) => ({
						id: new Date().getTime(),
						product: item,
					})
				);
			} catch (err) {
				console.error(err);
			}
		}
	}
	async getFavoritesByTypes(
		ids: number[],
		fetchFunc: (
			params: CollectionParams
		) => Promise<AxiosResponse<ApiResponse<Product[]>>>
	) {
		let result: Product[] = [];
		if (ids.length) {
			const {
				data: { data },
			} = await fetchFunc({
				filters: { id: ids },
			});
			result = data;
		}
		return result;
	}
	async addFavorite(favorite: Favorite) {
		if (this.root.user.id) {
			try {
				let {
					data: { data },
				} = await addFavorite(
					favorite.product.id,
					favorite.product.type
				);
				this.items.push(data);
			} catch (err) {
				console.log(err);
			}
		} else {
			saveFavoriteProductID(favorite.product.type, favorite.product.id);
			this.items.push(favorite);
		}
	}
	setFavorites(items: Favorite[]) {
		this.items = items;
	}
	async removeFavorite(favorite: Favorite) {
		let favoriteProductIDs = getFavoriteProductIDs();
		if (
			favoriteProductIDs[favorite.product.type].some(
				(productID) => productID === favorite.product.id
			)
		) {
			removeFavoriteProductID(favorite.product.type, favorite.product.id);
		} else {
			await removeFavorite(favorite.id);
		}
		this.items = this.items.filter(
			(el) => el.product.id !== favorite.product.id
		);
	}
	clearFavorites() {
		let favoriteProductIDs = getFavoriteProductIDs();
		this.items = this.items.filter((item) => {
			return Object.keys(favoriteProductIDs).filter((key) =>
				favoriteProductIDs[key as keyof FavoriteLocalStorage].some(
					(productId) => productId === item.id
				)
			);
		});
	}
}
