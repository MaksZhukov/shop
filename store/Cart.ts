import { ShoppingCartItem } from 'api/cart/types';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchTiers } from 'api/tires/tires';
import { ApiResponse, CollectionParams, Product } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import {
	getCartProducts,
	removeCartProduct,
	saveCartProduct,
} from 'services/LocalStorageService';
import RootStore from '.';
import {
	addToShoppingCart,
	getShoppingCart,
	removeItemFromShoppingCart,
} from '../api/cart/cart';

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
		if (this.root.user.jwt) {
			const {
				data: { data },
			} = await getShoppingCart();
			this.items = data;
		} else {
			const cartProducts = getCartProducts();
			try {
				const [spareParts, wheels, tires] = await Promise.all([
					this.getCartItemsByTypes(
						cartProducts
							.filter((item) => item.type === 'sparePart')
							.map((item) => item.id),
						fetchSpareParts
					),
					this.getCartItemsByTypes(
						cartProducts
							.filter((item) => item.type === 'wheel')
							.map((item) => item.id),
						fetchWheels
					),
					this.getCartItemsByTypes(
						cartProducts
							.filter((item) => item.type === 'tire')
							.map((item) => item.id),
						fetchTiers
					),
				]);

				this.items = [...spareParts, ...wheels, ...tires].map(
					(item) => ({
						id: new Date().getTime(),
						product: item,
					})
				);
			} catch (err) {
				console.error(err);
			}
		}
	}

	async getCartItemsByTypes(
		ids: number[],
		fetchFunc: (
			params: CollectionParams
		) => Promise<AxiosResponse<ApiResponse<Product[]>>>
	) {
		let result: Product[] = [];
		if (ids.length) {
			const {
				data: { data },
			} = await fetchFunc({
				filters: { id: ids },
			});
			result = data;
		}
		return result;
	}

	async addCartItem(cartItem: ShoppingCartItem) {
		let shoppingCartItem: ShoppingCartItem | null = null;
		if (this.root.user.id) {
			let { data } = await addToShoppingCart(
				cartItem.product.id,
				cartItem.product.type
			);
			shoppingCartItem = data.data;
		} else {
			shoppingCartItem = cartItem;
			saveCartProduct(cartItem.product.id, cartItem.product.type);
		}
		this.items.push(shoppingCartItem);
	}
	async removeCartItem(cartItem: ShoppingCartItem) {
		if (this.root.user.id) {
			await removeItemFromShoppingCart(cartItem.id);
		} else {
			removeCartProduct(cartItem.product.id, cartItem.product.type);
		}
		this.items = this.items.filter(
			(el) =>
				el.product.id !== cartItem.product.id &&
				el.product.type !== cartItem.product.type
		);
	}
	clearShoppingCart() {
		let cartProducts = getCartProducts();
		this.items = this.items.filter((item) =>
			cartProducts.some((product) => product.id === item.product.id)
		);
	}
}
