import { fetchCabins } from 'api/cabins/cabins';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchTires } from 'api/tires/tires';
import { ApiResponse, CollectionParams, Product } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import RootStore from '.';
import {
	addToShoppingCart,
	fetchShoppingCart,
	removeFromShoppingCart,
	removeFromShoppingCartMany
} from '../api/shopping-cart/shopping-cart';
import { ShoppingCart } from '../api/shopping-cart/types';
import { ShoppingCartService, StorageShoppingCart } from 'services/LocalStorageService/ShoppingCartService';

export default class ShoppingCartStore {
	root: RootStore;
	items: ShoppingCart[] = [];
	isLoading: boolean = false;
	shoppingCartLocalStorageService: ShoppingCartService;

	constructor(root: RootStore, shoppingCartLocalStorageService: ShoppingCartService) {
		this.root = root;
		this.shoppingCartLocalStorageService = shoppingCartLocalStorageService;
		makeAutoObservable(this);
	}
	async loadShoppingCart() {
		this.isLoading = true;
		if (this.root.user.jwt) {
			const {
				data: { data }
			} = await fetchShoppingCart();
			runInAction(() => {
				this.items = data;
			});
		} else {
			const cartItems = this.shoppingCartLocalStorageService.getShoppingCart();
			try {
				const [
					{ data: spareParts, irrelevantCartItemIDs: irrelevantCartItemsSparePartIDs },
					{ data: wheels, irrelevantCartItemIDs: irrelevantCartItemsWheelsIDs },
					{ data: tires, irrelevantCartItemIDs: irrelevantCartItemsTiresIDs },
					{ data: cabins, irrelevantCartItemIDs: irrelevantCartItemsCabinsIDs }
				] = await Promise.all([
					this.getShoppingCartByTypes(
						cartItems.filter((item) => item.product.type === 'sparePart'),
						fetchSpareParts
					),
					this.getShoppingCartByTypes(
						cartItems.filter((item) => item.product.type === 'wheel'),
						fetchWheels
					),
					this.getShoppingCartByTypes(
						cartItems.filter((item) => item.product.type === 'tire'),
						fetchTires
					),
					this.getShoppingCartByTypes(
						cartItems.filter((item) => item.product.type === 'cabin'),
						fetchCabins
					)
				]);

				this.shoppingCartLocalStorageService.removeShoppingCartItems([
					...irrelevantCartItemsSparePartIDs,
					...irrelevantCartItemsCabinsIDs,
					...irrelevantCartItemsTiresIDs,
					...irrelevantCartItemsWheelsIDs
				]);

				runInAction(() => {
					this.items = [...spareParts, ...wheels, ...tires, ...cabins];
				});
			} catch (err) {
				console.error(err);
			}
		}
		this.isLoading = false;
	}
	async getShoppingCartByTypes(
		cartItems: StorageShoppingCart[],
		fetchFunc: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>
	) {
		let result: { data: ShoppingCart[]; irrelevantCartItemIDs: number[] } = { data: [], irrelevantCartItemIDs: [] };
		if (cartItems.length) {
			const {
				data: { data }
			} = await fetchFunc({
				filters: { id: cartItems.map((item) => item.product.id), sold: false },
				populate: ['images', 'brand']
			});
			result.irrelevantCartItemIDs = cartItems
				.filter((cartItem) => !data.some((item) => cartItem.product.id === item.id))
				.map((item) => item.id);
			result.data = cartItems
				.filter((cartItem) => data.some((item) => cartItem.product.id === item.id))
				.map((item) => ({
					...item,
					product: data.find((el) => el.id === item.product.id) as Product
				}));
		}
		return result;
	}
	async addToShoppingCart(cartItem: ShoppingCart) {
		if (this.root.user.id) {
			try {
				let {
					data: { data }
				} = await addToShoppingCart(cartItem.product.id, cartItem.product.type);
				runInAction(() => {
					this.items.push(data);
				});
			} catch (err) {
				console.error(err);
			}
		} else {
			this.shoppingCartLocalStorageService.saveShoppingCartItem(cartItem);
			runInAction(() => {
				this.items.push(cartItem);
			});
		}
	}
	async removeFromShoppingCart(cartItem: ShoppingCart) {
		if (this.root.user.id) {
			await removeFromShoppingCart(cartItem.id);
		} else {
			this.shoppingCartLocalStorageService.removeShoppingCartItem(cartItem);
		}
		runInAction(() => {
			this.items = this.items.filter((el) => el.id !== cartItem.id);
		});
	}
	async removeFromShoppingCartMany(cartItemIDs: number[]) {
		if (this.root.user.id) {
			await removeFromShoppingCartMany(cartItemIDs);
		} else {
			this.shoppingCartLocalStorageService.removeShoppingCartItems(cartItemIDs);
		}
		runInAction(() => {
			this.items = this.items.filter((el) => !cartItemIDs.includes(el.id));
		});
	}

	async clearShoppingCart() {
		if (this.root.user.id) {
			const cartItemIDs = this.items.map((item) => item.id);
			if (cartItemIDs.length > 0) {
				await removeFromShoppingCartMany(cartItemIDs);
			}
		} else {
			this.shoppingCartLocalStorageService.clearShoppingCart();
		}
		runInAction(() => {
			this.items = [];
		});
	}
}
