import type { Cart } from './model/cartModel';
import { BaseStorageService } from 'shared/services';
import type { StorageCart } from './model/cartLocalStorageModel';

export class CartLocalStorage extends BaseStorageService {
	private readonly CART_KEY = 'cart';

	getCart(): StorageCart[] {
		return this.getItem(this.CART_KEY, []);
	}

	saveCartItem(cartItem: Cart): void {
		const cartItems = this.getCart();
		const storageCartItem: StorageCart = {
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

		this.saveCart(cartItems);
	}

	removeCartItem(cartItem: Cart): void {
		const cartItems = this.getCart();
		const filteredCartItems = cartItems.filter((item) => item.id !== cartItem.id);
		this.saveCart(filteredCartItems);
	}

	removeCartItems(cartItemIDs: number[]): void {
		const cartItems = this.getCart();
		const filteredCartItems = cartItems.filter((item) => !cartItemIDs.includes(item.id));
		this.saveCart(filteredCartItems);
	}

	clearCart(): void {
		this.removeItem(this.CART_KEY);
	}

	hasCartItem(cartItemId: number): boolean {
		const cartItems = this.getCart();
		return cartItems.some((item) => item.id === cartItemId);
	}

	getCartCount(): number {
		return this.getCart().length;
	}

	private saveCart(cartItems: StorageCart[]): void {
		this.setItem(this.CART_KEY, cartItems);
	}
}

export const cartLocalStorage = new CartLocalStorage();
