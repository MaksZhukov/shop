import { useLoadCart } from 'features/cart';
import { useLoadFavorites } from 'features/favorites';
import { useEffect } from 'react';
import { useLoadUserInfo } from 'features/user';
import { UserStore } from 'entities/user';
import { useInjection } from 'shared/di/di.hook';

export const useInitialAuthLoad = () => {
	const loadFavorites = useLoadFavorites();
	const loadCart = useLoadCart();
	const loadUserInfo = useLoadUserInfo();
	const userStore = useInjection(UserStore);

	useEffect(() => {
		const tryFetchData = async () => {
			try {
				await loadUserInfo();
				await Promise.all([loadCart(), loadFavorites()]);
			} catch {
				userStore.clearUser();
				await Promise.all([loadCart(), loadFavorites()]);
			}
			userStore.setIsInitialRequestDone();
		};
		tryFetchData();
	}, [loadFavorites, loadCart, loadUserInfo, userStore]);
};
