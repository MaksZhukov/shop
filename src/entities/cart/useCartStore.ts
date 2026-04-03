import { useContext } from 'react';
import { CartStore } from './cartStore';
import { CartStoreContext } from './cartContext';

export const useCartStore = (): CartStore => {
	const cartStore = useContext(CartStoreContext);
	if (!cartStore) {
		throw new Error('CartStore not found');
	}
	return cartStore;
};
