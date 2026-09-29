import type { Cart } from '../model/cart.model';
import type { StorageCart } from '../model/cartLocalStorage.model';

export const CART_PRODUCTS = Symbol('CartProducts');

/** Loads current products for guest cart items. Implemented in `app`, because products live in other entities. */
export interface CartProducts {
	findStored(items: StorageCart[]): Promise<{ found: Cart[]; missingIds: number[] }>;
}
