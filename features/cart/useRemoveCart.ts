import { useCartStore } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { cartApi, cartLocalStorage } from 'entities/cart';
import type { Cart } from 'entities/cart';

export const useRemoveCart = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();

	return async (cartItem: Cart) => {
		if (userStore.id) {
			await cartApi.removeFromShoppingCart(cartItem.id);
		} else {
			cartLocalStorage.removeCartItem(cartItem);
		}
		cartStore.removeItem(cartItem.id);
	};
};
