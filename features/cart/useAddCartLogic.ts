import { useCartStore } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { cartApi, cartLocalStorage } from 'entities/cart';
import type { Cart } from 'entities/cart';

export const useAddCartLogic = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();

	return async (cartItem: Cart) => {
		if (userStore.id) {
			try {
				let {
					data: { data }
				} = await cartApi.addToShoppingCart(cartItem.product.id, cartItem.product.type);
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
