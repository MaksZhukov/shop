import { CartStore } from 'entities/cart';
import { CartStoreContext } from 'entities/cart/cartContext';

const cartStore = new CartStore();

export const CartStoreProvider = ({ children }: { children: React.ReactNode }) => {
	return <CartStoreContext.Provider value={cartStore}>{children}</CartStoreContext.Provider>;
};
