import { api } from '..';
import { ApiResponse } from '../types';
import { ShoppingCartItem } from './types';

export const getShoppingCart = () =>
	api.get<ApiResponse<ShoppingCartItem[]>>('shopping-cart');

export const addToShoppingCart = (productId: number) =>
	api.post<ApiResponse<ShoppingCartItem>>('shopping-cart', {
		data: { product: productId },
	});

export const removeItemFromShoppingCart = (id: number) =>
	api.delete<ApiResponse<ShoppingCartItem>>(`shopping-cart/${id}`);

export const removeAllItemsFromShoppingCart = () => api.delete('shopping-cart');
