import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { Favorite } from './favoriteTypes';

export const favoriteApi = {
	fetchFavorites: () =>
		api.get<ApiResponse<Favorite[]>>('favorites', { params: { filters: { product: { sold: false } } } }),
	addFavorite: (productId: number, type: 'sparePart' | 'wheel' | 'tire' | 'cabin') =>
		api.post<ApiResponse<Favorite>>('favorites', {
			data: {
				product: [
					{
						__component: `product.${type === 'sparePart' ? 'spare-part' : type}`,
						product: productId
					}
				]
			}
		}),
	removeFavorite: (favoriteId: number) => api.delete(`favorites/${favoriteId}`),
	removeFavorites: (ids: number[]) => api.delete(`favorites`, { params: { ids } })
};
