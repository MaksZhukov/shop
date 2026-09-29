import 'reflect-metadata';
import { action, withAsync, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import {
	CartStore,
	LocalCartApi,
	RemoteCartApi,
	type Cart,
	type CartApi
} from 'entities/cart';
import type { Product } from 'entities/product';
import { SnackbarService } from 'shared/services';
import { SessionStore } from 'core/session';
import { CART_ADD_ERROR, CART_ADD_SUCCESS, CART_REMOVE_ERROR, CART_REMOVE_SUCCESS } from './cartList.constants';

@injectable()
export class CartListService {
	readonly load = action(async () => {
		this.cartStore.setItems(await wrap(this.api.load()));
	}, 'cartList.load').extend(withAsync());

	readonly toggle = action(async (product: Product) => {
		const cartItem = this.findItem(product);
		if (cartItem) {
			await wrap(this.notify(this.remove(cartItem), CART_REMOVE_SUCCESS, CART_REMOVE_ERROR));
		} else {
			await wrap(this.notify(this.add(product), CART_ADD_SUCCESS, CART_ADD_ERROR));
		}
	}, 'cartList.toggle').extend(withAsync());

	constructor(
		@inject(CartStore) private readonly cartStore: CartStore,
		@inject(SessionStore) private readonly sessionStore: SessionStore,
		@inject(RemoteCartApi) private readonly remote: RemoteCartApi,
		@inject(LocalCartApi) private readonly local: LocalCartApi,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}

	// The only place that knows about auth: every call goes to the storage of the current session.
	private get api(): CartApi {
		return this.sessionStore.isAuth() ? this.remote : this.local;
	}

	findItem(product: Product) {
		return this.cartStore.items.find((item) => item.product.id === product.id && item.product.type === product.type);
	}

	async add(product: Product) {
		const item = await this.api.add({ id: Date.now(), product });
		this.cartStore.addItem(item);
	}

	async remove(item: Cart) {
		await this.api.remove(item);
		this.cartStore.removeItem(item.id);
	}

	async removeMany(ids: number[]) {
		await this.api.removeMany(ids);
		this.cartStore.removeItems(ids);
	}

	private async notify(request: Promise<void>, success: string, error: string) {
		try {
			await request;
			this.snackbarService.success(success);
		} catch {
			this.snackbarService.error(error);
		}
	}
}
