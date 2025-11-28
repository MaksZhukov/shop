import { api } from '..';
import { ApiResponse } from '../types';
import { ShoppingCart } from './types';

export const fetchShoppingCart = () =>
	api.get<ApiResponse<ShoppingCart[]>>('shopping-cart', { params: { filters: { product: { sold: false } } } });

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
