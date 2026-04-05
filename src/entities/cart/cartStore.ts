import { makeAutoObservable } from 'mobx';
import type { Cart } from './model/cartModel';

// Pure MobX store
export class CartStore {
	items: Cart[] = [];
	isLoading = false;
	selectedItemsForCheckout: number[] = [];

	constructor() {
		makeAutoObservable(this);
	}

	setItems(items: Cart[]) {
		this.items = items;
	}

	setIsLoading(isLoading: boolean) {
		this.isLoading = isLoading;
	}

	addItem(item: Cart) {
		this.items.push(item);
	}

	removeItem(cartId: number) {
		this.items = this.items.filter((el) => el.id !== cartId);
	}

	removeItems(cartIDs: number[]) {
		this.items = this.items.filter((el) => !cartIDs.includes(el.id));
	}

	clearItems() {
		this.items = [];
	}

	setSelectedItemsForCheckout(itemIds: number[]) {
		this.selectedItemsForCheckout = itemIds;
	}

	clearSelectedItemsForCheckout() {
		this.selectedItemsForCheckout = [];
	}
}
