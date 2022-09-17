import { api } from '..';
import { ApiResponse } from '../types';
import { ShoppingCartItem } from './types';

export const getShoppingCart = () =>
	api.get<ApiResponse<ShoppingCartItem[]>>('shopping-cart');

export const addToShoppingCart = (
	productId: number,
	type: 'sparePart' | 'wheel' | 'tire'
) =>
	api.post<ApiResponse<ShoppingCartItem>>('shopping-cart', {
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

export const removeItemFromShoppingCart = (id: number) =>
	api.delete<ApiResponse<ShoppingCartItem>>(`shopping-cart/${id}`);

export const removeAllItemsFromShoppingCart = () => api.delete('shopping-cart');
