import { cartLocalStorage } from 'entities/cart';
import type { Cart } from 'entities/cart';
import { useDI } from './cart.di';

export const useRemoveCart = () => {
	const { cartStore, userStore, cartService } = useDI();

	return async (cartItem: Cart) => {
		if (userStore.id) {
			await cartService.removeFromShoppingCart(cartItem.id);
		} else {
			cartLocalStorage.removeCartItem(cartItem);
		}
		cartStore.removeItem(cartItem.id);
	};
};
