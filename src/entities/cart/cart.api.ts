import 'reflect-metadata';
import { injectable } from 'inversify';
import { API_MAX_LIMIT } from 'shared/api/constants';
import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { ApiCart, Cart } from './model/cart.model';

export const CART_API = Symbol('CartApi');

@injectable()
export class CartApi {
	fetchShoppingCart(userId: number) {
		return api.get<ApiResponse<ApiCart[]>>('shopping-cart', {
			params: {
				pagination: { limit: API_MAX_LIMIT },
				populate: ['product.product.images', 'product.product.brand'],
				filters: {
					user: userId
				}
			}
		});
	}

	addToShoppingCart(productId: number, type: 'sparePart' | 'wheel' | 'tire' | 'cabin') {
		return api.post<ApiResponse<Cart>>('shopping-cart', {
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

	removeFromShoppingCart(cartId: number) {
		return api.delete(`shopping-cart/${cartId}`);
	}

	removeFromShoppingCartMany(ids: number[]) {
		return api.delete(`shopping-cart`, { params: { ids } });
	}
}

export const cartApi = new CartApi();

