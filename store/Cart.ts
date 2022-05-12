import { makeAutoObservable } from 'mobx';
import RootStore from '.';
import { getShoppingCart } from '../api/cart/cart';

export interface Cart {
    items: any[];
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
}
