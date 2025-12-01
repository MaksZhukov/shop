import { API_MAX_LIMIT } from 'api/constants';
import { api } from '..';
import { ApiResponse } from '../types';
import { ShoppingCart } from './types';

export const fetchShoppingCart = () =>
	api.get<ApiResponse<ShoppingCart[]>>('shopping-cart', { params: { pagination: { limit: API_MAX_LIMIT } } });

export const addToShoppingCart = (productId: number, type: 'sparePart' | 'wheel' | 'tire' | 'cabin') =>
	api.post<ApiResponse<ShoppingCart>>('shopping-cart', {
		data: {
			product: [
				{
					__component: `product.${type === 'sparePart' ? 'spare-part' : type}`,
					product: productId
				}
			]
		}
	});

export const removeFromShoppingCart = (cartId: number) => api.delete(`shopping-cart/${cartId}`);
export const removeFromShoppingCartMany = (ids: number[]) => api.delete(`shopping-cart`, { params: { ids } });
