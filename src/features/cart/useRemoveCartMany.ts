import { useCartStore, cartLocalStorage, CartService } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { inject } from './cart.di';

export const useRemoveCartMany = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();
	const cartService = inject(CartService);

	return async (cartItemIDs: number[]) => {
		if (userStore.id) {
			await cartService.removeFromShoppingCartMany(cartItemIDs);
		} else {
			cartLocalStorage.removeCartItems(cartItemIDs);
		}
		cartStore.removeItems(cartItemIDs);
	};
};
