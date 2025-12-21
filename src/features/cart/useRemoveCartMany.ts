import { useCartStore } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { cartApi, cartLocalStorage } from 'entities/cart';

export const useRemoveCartMany = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();

	return async (cartItemIDs: number[]) => {
		if (userStore.id) {
			await cartApi.removeFromShoppingCartMany(cartItemIDs);
		} else {
			cartLocalStorage.removeCartItems(cartItemIDs);
		}
		cartStore.removeItems(cartItemIDs);
	};
};
