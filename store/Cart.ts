import { ShoppingCartItem } from 'api/cart/types';
import { fetchProducts } from 'api/products/products';
import { Product } from 'api/products/types';
import { makeAutoObservable } from 'mobx';
import { getCartProductIDs, removeCartProductID, saveCartProductID } from 'services/LocalStorageService';
import RootStore from '.';
import { addToShoppingCart, getShoppingCart, removeItemFromShoppingCart } from '../api/cart/cart';

export interface Cart {
    items: ShoppingCartItem[];
}

export default class CartStore implements Cart {
    root: RootStore;

    items: ShoppingCartItem[] = [];

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }
    async loadShoppingCart() {
        const {
            data: { data },
        } = await getShoppingCart();
        const cartItems = await this.getShoppingCartByLocalStorage(data);
        this.items = [...data, ...cartItems];
    }
    async getShoppingCartByLocalStorage(userCartItems: ShoppingCartItem[] = []) {
        let cartProductIDs = getCartProductIDs();
        let uniqueCartProductIDs = cartProductIDs.filter(id => !userCartItems.some(item => item.product.id === id));
        if (!uniqueCartProductIDs.length) {
            return [];
        }
        const {
            data: { data: products }
        } = await fetchProducts({ filters: { id: uniqueCartProductIDs } });
        let cartItems: ShoppingCartItem[] = products.map((item) => ({
            id: new Date().getTime(),
            product: item
        }));
        return cartItems;
    }
    async addCartItem(product: Product) {
        let shoppingCartItem: ShoppingCartItem | null = null;
        if (this.root.user.id) {
            let { data } = await addToShoppingCart(product.id);
            shoppingCartItem = data.data;
        } else {
            shoppingCartItem = { id: new Date().getTime(), product };
            saveCartProductID(product.id);
        }
        this.items.push(shoppingCartItem);
    }
    setCartItems(items: ShoppingCartItem[]) {
        this.items = items;
    }
    async removeCartItem(productId: number, cartItemId: number) {
        let cartProductIDs = getCartProductIDs();
        if (cartProductIDs.some(productID => productID === productId)) {
            removeCartProductID(productId);
        } else {
            await removeItemFromShoppingCart(cartItemId);
        }
        this.items = this.items.filter((el) => el.product.id !== productId);
    }
    clearShoppingCart() {
        let cartProductIDs = getCartProductIDs();
        this.items = this.items.filter(item => cartProductIDs.some(productID => productID === item.product.id));
    }
}
