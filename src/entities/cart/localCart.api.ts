import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseStorageService } from 'shared/services';
import type { CartApi } from './cart.api';
import type { Cart } from './model/cart.model';
import type { StorageCart } from './model/cartLocalStorage.model';
import { CART_PRODUCTS, type CartProducts } from './ports/cartProducts.port';

const CART_KEY = 'cart';

@injectable()
export class LocalCartApi extends BaseStorageService implements CartApi {
	constructor(@inject(CART_PRODUCTS) private readonly cartProducts: CartProducts) {
		super();
	}

	/** Guest items as saved: ids and product references, without product data. */
	getStored(): StorageCart[] {
		return this.getItem(CART_KEY, []);
	}

	// Local storage keeps only ids, so products are refetched and sold or deleted ones are dropped.
	async load() {
		const { found, missingIds } = await this.cartProducts.findStored(this.getStored());
		await this.removeMany(missingIds);
		return found;
	}

	async add(item: Cart) {
		const stored: StorageCart = { ...item, product: { id: item.product.id, type: item.product.type } };
		this.save([...this.getStored().filter((cartItem) => cartItem.id !== item.id), stored]);
		return item;
	}

	async remove(item: Cart) {
		await this.removeMany([item.id]);
	}

	async removeMany(ids: number[]) {
		this.save(this.getStored().filter((item) => !ids.includes(item.id)));
	}

	private save(items: StorageCart[]) {
		this.setItem(CART_KEY, items);
	}
}
