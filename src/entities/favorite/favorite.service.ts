import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { FAVORITE_API, FavoriteApi } from './favorite.api';
import type { FavoriteReader } from './ports/favorite.port';

@injectable()
export class FavoriteService implements FavoriteReader {
	constructor(@inject(FAVORITE_API) private readonly favoriteApi: FavoriteApi) {}

	fetchFavorites() {
		return this.favoriteApi.fetchFavorites();
	}

	addFavorite(productId: number, type: 'sparePart' | 'wheel' | 'tire' | 'cabin') {
		return this.favoriteApi.addFavorite(productId, type);
	}

	removeFavorite(favoriteId: number) {
		return this.favoriteApi.removeFavorite(favoriteId);
	}

	removeFavorites(ids: number[]) {
		return this.favoriteApi.removeFavorites(ids);
	}
}
