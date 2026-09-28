import { useCartStore, cartLocalStorage, CartService } from 'entities/cart';
import { useUserStore } from 'entities/user';
import type { Cart } from 'entities/cart';
import { inject } from './cart.di';

export const useAddCartLogic = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();
	const cartService = inject(CartService);

	return async (cartItem: Cart) => {
		if (userStore.id) {
			try {
				let {
					data: { data }
				} = await cartService.addToShoppingCart(cartItem.product.id, cartItem.product.type);
				cartStore.addItem(data);
			} catch (err) {
				console.error(err);
				throw err;
			}
		} else {
			cartLocalStorage.saveCartItem(cartItem);
			cartStore.addItem(cartItem);
		}
	};
};
