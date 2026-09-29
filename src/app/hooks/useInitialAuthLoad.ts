import { CartListService } from 'features/cart';
import { FavoriteListService } from 'features/favorites';
import { useEffect } from 'react';
import { useLoadUserInfo } from 'features/user';
import { UserStore } from 'entities/user';
import { useInjection } from 'shared/di/di.hook';

export const useInitialAuthLoad = () => {
	const cartListService = useInjection(CartListService);
	const favoriteListService = useInjection(FavoriteListService);
	const loadUserInfo = useLoadUserInfo();
	const userStore = useInjection(UserStore);

	useEffect(() => {
		const loadSessionItems = () => Promise.all([cartListService.load(), favoriteListService.load()]);
		const tryFetchData = async () => {
			try {
				await loadUserInfo();
				await loadSessionItems();
			} catch {
				userStore.clearUser();
				await loadSessionItems();
			}
			userStore.setIsInitialRequestDone();
		};
		tryFetchData();
	}, [cartListService, favoriteListService, loadUserInfo, userStore]);
};
