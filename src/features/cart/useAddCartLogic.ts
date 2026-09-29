import { cartLocalStorage } from 'entities/cart';
import type { Cart } from 'entities/cart';
import { useDI } from './cart.di';

export const useAddCartLogic = () => {
	const { cartStore, userStore, cartService } = useDI();

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
