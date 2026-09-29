import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseStorageService } from 'shared/services';
import type { FavoriteApi } from './favorite.api';
import type { Favorite } from './model/favorite.model';
import type { StorageFavorite } from './model/favoriteLocalStorage.model';
import { FAVORITE_PRODUCTS, type FavoriteProducts } from './ports/favoriteProducts.port';

const FAVORITES_KEY = 'favorites';

@injectable()
export class LocalFavoriteApi extends BaseStorageService implements FavoriteApi {
	constructor(@inject(FAVORITE_PRODUCTS) private readonly favoriteProducts: FavoriteProducts) {
		super();
	}

	/** Guest favorites as saved: ids and product references, without product data. */
	getStored(): StorageFavorite[] {
		return this.getItem(FAVORITES_KEY, []);
	}

	// Local storage keeps only ids, so products are refetched and sold or deleted ones are dropped.
	async load() {
		const { found, missingIds } = await this.favoriteProducts.findStored(this.getStored());
		this.save(this.getStored().filter((item) => !missingIds.includes(item.id)));
		return found;
	}

	async add(favorite: Favorite) {
		const stored: StorageFavorite = { ...favorite, product: { id: favorite.product.id, type: favorite.product.type } };
		this.save([...this.getStored().filter((item) => item.id !== favorite.id), stored]);
		return favorite;
	}

	async remove(favorite: Favorite) {
		this.save(this.getStored().filter((item) => item.id !== favorite.id));
	}

	private save(items: StorageFavorite[]) {
		this.setItem(FAVORITES_KEY, items);
	}
}
