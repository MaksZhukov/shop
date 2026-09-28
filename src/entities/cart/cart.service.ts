import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CART_API, CartApi } from './cart.api';
import type { CartReader } from './ports/cart.port';

@injectable()
export class CartService implements CartReader {
	constructor(@inject(CART_API) private readonly cartApi: CartApi) {}

	fetchShoppingCart(userId: number) {
		return this.cartApi.fetchShoppingCart(userId);
	}

	addToShoppingCart(productId: number, type: 'sparePart' | 'wheel' | 'tire' | 'cabin') {
		return this.cartApi.addToShoppingCart(productId, type);
	}

	removeFromShoppingCart(cartId: number) {
		return this.cartApi.removeFromShoppingCart(cartId);
	}

	removeFromShoppingCartMany(ids: number[]) {
		return this.cartApi.removeFromShoppingCartMany(ids);
	}
}
