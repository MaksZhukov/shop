import { ShoppingCart } from 'api/shopping-cart/types';
import { BaseStorageService } from '../BaseStorageService';
import { StorageShoppingCart } from './types';

export class ShoppingCartService extends BaseStorageService {
	private readonly SHOPPING_CART_KEY = 'shoppingCartProducts';

	getShoppingCart(): StorageShoppingCart[] {
		return this.getItem(this.SHOPPING_CART_KEY, []);
	}

	saveShoppingCartItem(cartItem: ShoppingCart): void {
		const cartItems = this.getShoppingCart();
		const storageCartItem: StorageShoppingCart = {
			...cartItem,
			product: {
				id: cartItem.product.id,
				type: cartItem.product.type
			}
		};

		const existingIndex = cartItems.findIndex((item) => item.id === cartItem.id);
		if (existingIndex >= 0) {
			cartItems[existingIndex] = storageCartItem;
		} else {
			cartItems.push(storageCartItem);
		}

		this.saveShoppingCart(cartItems);
	}

	removeShoppingCartItem(cartItem: ShoppingCart): void {
		const cartItems = this.getShoppingCart();
		const filteredCartItems = cartItems.filter((item) => item.id !== cartItem.id);
		this.saveShoppingCart(filteredCartItems);
	}

	removeShoppingCartItems(cartItemIDs: number[]): void {
		const cartItems = this.getShoppingCart();
		const filteredCartItems = cartItems.filter((item) => !cartItemIDs.includes(item.id));
		this.saveShoppingCart(filteredCartItems);
	}

	clearShoppingCart(): void {
		this.removeItem(this.SHOPPING_CART_KEY);
	}

	hasShoppingCartItem(cartItemId: number): boolean {
		const cartItems = this.getShoppingCart();
		return cartItems.some((item) => item.id === cartItemId);
	}

	getShoppingCartCount(): number {
		return this.getShoppingCart().length;
	}

	private saveShoppingCart(cartItems: StorageShoppingCart[]): void {
		this.setItem(this.SHOPPING_CART_KEY, cartItems);
	}
}
