import { API_MAX_LIMIT } from 'shared/api/constants';
import { api } from 'shared/api';
import { ApiResponse } from 'shared/api/types';
import { Cart } from './cartTypes';

export const cartApi = {
	fetchShoppingCart: () =>
		api.get<ApiResponse<Cart[]>>('shopping-cart', { params: { pagination: { limit: API_MAX_LIMIT } } }),
	addToShoppingCart: (productId: number, type: 'sparePart' | 'wheel' | 'tire' | 'cabin') =>
		api.post<ApiResponse<Cart>>('shopping-cart', {
			data: {
				product: [
					{
						__component: `product.${type === 'sparePart' ? 'spare-part' : type}`,
						product: productId
					}
				]
			}
		}),
	removeFromShoppingCart: (cartId: number) => api.delete(`shopping-cart/${cartId}`),
	removeFromShoppingCartMany: (ids: number[]) => api.delete(`shopping-cart`, { params: { ids } })
};
