import { useCartStore, cartLocalStorage, CartService } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { inject } from './cart.di';

export const clearCart = async (
	cartStore: ReturnType<typeof useCartStore>,
	userStore: ReturnType<typeof useUserStore>,
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
	const cartStore = useCartStore();
	const userStore = useUserStore();
	const cartService = inject(CartService);
	return () => clearCart(cartStore, userStore, cartService);
};
