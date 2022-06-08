import { ShoppingCartItem } from 'api/cart/types';
import { makeAutoObservable } from 'mobx';
import RootStore from '.';
import { getShoppingCart } from '../api/cart/cart';

export interface Cart {
	items: ShoppingCartItem[];
}

export default class CartStore implements Cart {
	root: RootStore;

	items: any[] = [];

	constructor(root: RootStore) {
		this.root = root;
		makeAutoObservable(this);
	}
	async getShoppingCart() {
		const {
			data: { data },
		} = await getShoppingCart();
		this.items = data;
	}
	addCartItem(item: ShoppingCartItem) {
		this.items.push(item);
	}
	removeCartItem(id: number) {
		this.items = this.items.filter((el) => el.id !== id);
	}
	clearShoppingCart() {
		this.items = [];
	}
}
