import { cartLocalStorage } from 'entities/cart';
import { useDI } from './cart.di';

export const useRemoveCartMany = () => {
	const { cartStore, userStore, cartService } = useDI();

	return async (cartItemIDs: number[]) => {
		if (userStore.id) {
			await cartService.removeFromShoppingCartMany(cartItemIDs);
		} else {
			cartLocalStorage.removeCartItems(cartItemIDs);
		}
		cartStore.removeItems(cartItemIDs);
	};
};
