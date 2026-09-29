import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { FavoriteApi } from './favorite.api';
import type { Favorite } from './model/favorite.model';

const FAVORITES_URL = 'favorites';

@injectable()
export class RemoteFavoriteApi implements FavoriteApi {
	async load() {
		const {
			data: { data }
		} = await api.get<ApiResponse<Favorite[]>>(FAVORITES_URL, { params: { filters: { product: { sold: false } } } });
		return data;
	}

	async add(favorite: Favorite) {
		const { type, id } = favorite.product;
		const {
			data: { data }
		} = await api.post<ApiResponse<Favorite>>(FAVORITES_URL, {
			data: {
				product: [{ __component: `product.${type === 'sparePart' ? 'spare-part' : type}`, product: id }]
			}
		});
		return data;
	}

	async remove(favorite: Favorite) {
		await api.delete(`${FAVORITES_URL}/${favorite.id}`);
	}
}
