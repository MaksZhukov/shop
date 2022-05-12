import { makeAutoObservable } from 'mobx';
import RootStore from '.';
import { getShoppingCart } from '../api/cart/cart';

export interface Cart {
    products: any[]
}

export default class CartStore implements Cart {
    root: RootStore;

    products: any[] = [];

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }
    async getShoppingCart() {
        const { data } = getShoppingCart()
    }
}
