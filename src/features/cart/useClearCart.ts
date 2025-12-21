import { useCartStore } from 'entities/cart';
import { useUserStore } from 'entities/user';
import { cartApi, cartLocalStorage } from 'entities/cart';

export const clearCart = async (
	cartStore: ReturnType<typeof useCartStore>,
	userStore: ReturnType<typeof useUserStore>
) => {
	if (userStore.id) {
		const cartItemIDs = cartStore.items.map((item) => item.id);
		if (cartItemIDs.length > 0) {
			await cartApi.removeFromShoppingCartMany(cartItemIDs);
		}
	} else {
		cartLocalStorage.clearCart();
	}
	cartStore.clearItems();
};

export const useClearCart = () => {
	const cartStore = useCartStore();
	const userStore = useUserStore();
	return () => clearCart(cartStore, userStore);
};
