import { atom } from '@reatom/core';
import type { Cart } from './model/cart.model';

const itemsAtom = atom<Cart[]>([], 'cart.items');
const isLoadingAtom = atom(false, 'cart.isLoading');
const selectedItemsForCheckoutAtom = atom<number[]>([], 'cart.selectedItemsForCheckout');

export const cartStore = {
	get items() {
		return itemsAtom();
	},
	get isLoading() {
		return isLoadingAtom();
	},
	get selectedItemsForCheckout() {
		return selectedItemsForCheckoutAtom();
	},
	setItems(items: Cart[]) {
		itemsAtom.set(items);
	},
	setIsLoading(isLoading: boolean) {
		isLoadingAtom.set(isLoading);
	},
	addItem(item: Cart) {
		itemsAtom.set((items) => [...items, item]);
	},
	removeItem(cartId: number) {
		itemsAtom.set((items) => items.filter((item) => item.id !== cartId));
	},
	removeItems(cartIds: number[]) {
		itemsAtom.set((items) => items.filter((item) => !cartIds.includes(item.id)));
	},
	clearItems() {
		itemsAtom.set([]);
	},
	setSelectedItemsForCheckout(itemIds: number[]) {
		selectedItemsForCheckoutAtom.set(itemIds);
	},
	clearSelectedItemsForCheckout() {
		selectedItemsForCheckoutAtom.set([]);
	}
};
