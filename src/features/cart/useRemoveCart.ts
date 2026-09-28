import { useCartStore, cartLocalStorage, CartService } from 'entities/cart';
import { useUserStore } from 'entities/user';
import type { Cart } from 'entities/cart';
import { inject } from './cart.di';

export const useRemoveCart = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();
	const cartService = inject(CartService);

	return async (cartItem: Cart) => {
		if (userStore.id) {
			await cartService.removeFromShoppingCart(cartItem.id);
		} else {
			cartLocalStorage.removeCartItem(cartItem);
		}
		cartStore.removeItem(cartItem.id);
	};
};
