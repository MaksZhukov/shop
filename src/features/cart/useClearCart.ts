import { cartLocalStorage, CartService, type CartStore } from 'entities/cart';
import { type UserStore } from 'entities/user';
import { useDI } from './cart.di';

export const clearCart = async (
	cartStore: CartStore,
	userStore: UserStore,
	cartService: CartService
) => {
	if (userStore.id) {
		const cartItemIDs = cartStore.items.map((item) => item.id);
		if (cartItemIDs.length > 0) {
			await cartService.removeFromShoppingCartMany(cartItemIDs);
		}
	} else {
		cartLocalStorage.clearCart();
	}
	cartStore.clearItems();
};

export const useClearCart = () => {
	const { cartStore, userStore, cartService } = useDI();
	return () => clearCart(cartStore, userStore, cartService);
};
