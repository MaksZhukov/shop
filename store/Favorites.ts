import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchTires } from 'api/tires/tires';
import { ApiResponse, CollectionParams, Product } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import {
	getFavoriteProducts,
	removeFavoriteProduct,
	saveFavoriteProduct,
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
			const favoriteProducts = getFavoriteProducts();
			try {
				const [spareParts, wheels, tires] = await Promise.all([
					this.getFavoritesByTypes(
						favoriteProducts
							.filter((item) => item.type === 'sparePart')
							.map((item) => item.id),
						fetchSpareParts
					),
					this.getFavoritesByTypes(
						favoriteProducts
							.filter((item) => item.type === 'wheel')
							.map((item) => item.id),
						fetchWheels
					),
					this.getFavoritesByTypes(
						favoriteProducts
							.filter((item) => item.type === 'tire')
							.map((item) => item.id),
						fetchTires
					),
				]);

				this.items = [...spareParts, ...wheels, ...tires].map(
					(item) => ({
						id: new Date().getTime(),
						uid: new Date().getTime().toString(),
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
			saveFavoriteProduct(favorite.product.id, favorite.product.type);
			this.items.push(favorite);
		}
	}
	async removeFavorite(favorite: Favorite) {
		if (this.root.user.id) {
			await removeFavorite(favorite.id);
		} else {
			removeFavoriteProduct(favorite.product.id, favorite.product.type);
		}
		this.items = this.items.filter(
			(el) =>
				el.product.id !== favorite.product.id &&
				el.product.type === favorite.product.type
		);
	}
	clearFavorites() {
		let favoriteProducts = getFavoriteProducts();
		this.items = this.items.filter((item) => {
			return favoriteProducts.filter(
				(el) => el.id === item.id && el.type === item.product.type
			);
		});
	}
}
