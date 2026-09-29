import 'reflect-metadata';
import { atom } from '@reatom/core';
import { injectable } from 'inversify';
import type { Cart } from './model/cart.model';

@injectable()
export class CartStore {
	private readonly itemsAtom = atom<Cart[]>([], 'cart.items');
	private readonly isLoadingAtom = atom(false, 'cart.isLoading');
	private readonly selectedItemsForCheckoutAtom = atom<number[]>([], 'cart.selectedItemsForCheckout');

	get items() {
		return this.itemsAtom();
	}
	get isLoading() {
		return this.isLoadingAtom();
	}
	get selectedItemsForCheckout() {
		return this.selectedItemsForCheckoutAtom();
	}
	setItems(items: Cart[]) {
		this.itemsAtom.set(items);
	}
	setIsLoading(isLoading: boolean) {
		this.isLoadingAtom.set(isLoading);
	}
	addItem(item: Cart) {
		this.itemsAtom.set((items) => [...items, item]);
	}
	removeItem(cartId: number) {
		this.itemsAtom.set((items) => items.filter((item) => item.id !== cartId));
	}
	removeItems(cartIds: number[]) {
		this.itemsAtom.set((items) => items.filter((item) => !cartIds.includes(item.id)));
	}
	clearItems() {
		this.itemsAtom.set([]);
	}
	setSelectedItemsForCheckout(itemIds: number[]) {
		this.selectedItemsForCheckoutAtom.set(itemIds);
	}
	clearSelectedItemsForCheckout() {
		this.selectedItemsForCheckoutAtom.set([]);
	}
}
