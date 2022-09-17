import { api } from '..';
import { ApiResponse } from '../types';
import { Favorite } from './types';

export const fetchFavorites = () =>
	api.get<ApiResponse<Favorite[]>>('favorites');

export const addFavorite = (
	productId: number,
	type: 'sparePart' | 'wheel' | 'tire'
) =>
	api.post<ApiResponse<Favorite>>('favorites', {
		data: {
			product: [
				{
					__component: `product.${
						type === 'sparePart' ? 'spare-part' : type
					}`,
					product: productId,
				},
			],
		},
	});

export const removeFavorite = (favoriteId: number) =>
	api.delete(`favorites/${favoriteId}`);
