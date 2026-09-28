import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { Favorite } from './model/favorite.model';

export const FAVORITE_API = Symbol('FavoriteApi');

@injectable()
export class FavoriteApi {
	fetchFavorites() {
		return api.get<ApiResponse<Favorite[]>>('favorites', { params: { filters: { product: { sold: false } } } });
	}

	addFavorite(productId: number, type: 'sparePart' | 'wheel' | 'tire' | 'cabin') {
		return api.post<ApiResponse<Favorite>>('favorites', {
			data: {
				product: [
					{
						__component: `product.${type === 'sparePart' ? 'spare-part' : type}`,
						product: productId
					}
				]
			}
		});
	}

	removeFavorite(favoriteId: number) {
		return api.delete(`favorites/${favoriteId}`);
	}

	removeFavorites(ids: number[]) {
		return api.delete(`favorites`, { params: { ids } });
	}
}

export const favoriteApi = new FavoriteApi();

