import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { CartStore } from './cartStore';

export const useCartStore = (): CartStore => {
	const { store } = useContext(MobXProviderContext) as { store: { cart: CartStore } };
	return store.cart;
};
