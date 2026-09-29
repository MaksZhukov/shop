import 'reflect-metadata';
import { action, withAsync, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import { CartStore, LocalCartApi } from 'entities/cart';
import { FavoriteStore, LocalFavoriteApi } from 'entities/favorite';
import { UserService, UserStore } from 'entities/user';
import { SnackbarService } from 'shared/services';
import { LOGOUT_ERROR, LOGOUT_SUCCESS } from './profile.constants';

@injectable()
export class ProfileService {
	readonly logout = action(async () => {
		this.clearSession();
		try {
			await wrap(this.userService.logout());
			this.snackbarService.success(LOGOUT_SUCCESS);
		} catch {
			this.snackbarService.error(LOGOUT_ERROR);
		}
	}, 'profile.logout').extend(withAsync());

	constructor(
		@inject(UserService) private readonly userService: UserService,
		@inject(UserStore) private readonly userStore: UserStore,
		@inject(CartStore) private readonly cartStore: CartStore,
		@inject(FavoriteStore) private readonly favoriteStore: FavoriteStore,
		@inject(LocalCartApi) private readonly localCartApi: LocalCartApi,
		@inject(LocalFavoriteApi) private readonly localFavoriteApi: LocalFavoriteApi,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}

	// Drop account data and keep only the guest items saved in local storage.
	private clearSession() {
		this.userStore.clearUser();

		const guestCart = this.localCartApi.getStored();
		this.cartStore.setItems(this.cartStore.items.filter((item) => guestCart.some((el) => el.id === item.id)));
		this.cartStore.clearSelectedItemsForCheckout();

		const guestFavorites = this.localFavoriteApi.getStored();
		this.favoriteStore.setItems(
			this.favoriteStore.items.filter((item) => guestFavorites.some((el) => el.id === item.id))
		);
	}
}
