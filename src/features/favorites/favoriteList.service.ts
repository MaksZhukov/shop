import 'reflect-metadata';
import { action, withAsync, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import {
	FavoriteStore,
	LocalFavoriteApi,
	RemoteFavoriteApi,
	type Favorite,
	type FavoriteApi
} from 'entities/favorite';
import type { Product } from 'entities/product';
import { SnackbarService } from 'shared/services';
import { SessionStore } from 'core/session';
import {
	FAVORITE_ADD_ERROR,
	FAVORITE_ADD_SUCCESS,
	FAVORITE_REMOVE_ERROR,
	FAVORITE_REMOVE_SUCCESS
} from './favoriteList.constants';

@injectable()
export class FavoriteListService {
	readonly load = action(async () => {
		this.favoriteStore.setItems(await wrap(this.api.load()));
	}, 'favoriteList.load').extend(withAsync());

	readonly toggle = action(async (product: Product) => {
		const favorite = this.findItem(product);
		if (favorite) {
			await wrap(this.notify(this.remove(favorite), FAVORITE_REMOVE_SUCCESS, FAVORITE_REMOVE_ERROR));
		} else {
			await wrap(this.notify(this.add(product), FAVORITE_ADD_SUCCESS, FAVORITE_ADD_ERROR));
		}
	}, 'favoriteList.toggle').extend(withAsync());

	constructor(
		@inject(FavoriteStore) private readonly favoriteStore: FavoriteStore,
		@inject(SessionStore) private readonly sessionStore: SessionStore,
		@inject(RemoteFavoriteApi) private readonly remote: RemoteFavoriteApi,
		@inject(LocalFavoriteApi) private readonly local: LocalFavoriteApi,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}

	// The only place that knows about auth: every call goes to the storage of the current session.
	private get api(): FavoriteApi {
		return this.sessionStore.isAuth() ? this.remote : this.local;
	}

	findItem(product: Product) {
		return this.favoriteStore.items.find(
			(item) => item.product.id === product.id && item.product.type === product.type
		);
	}

	async add(product: Product) {
		const favorite = await this.api.add({ id: Date.now(), product });
		this.favoriteStore.addItem(favorite);
	}

	async remove(favorite: Favorite) {
		await this.api.remove(favorite);
		this.favoriteStore.removeItem(favorite.id);
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
