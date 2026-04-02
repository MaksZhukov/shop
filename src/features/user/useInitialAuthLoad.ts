import { useUserStore } from 'entities/user';
import { useLoadCart } from 'features/cart/useLoadCart';
import { useLoadFavorites } from 'features/favorites/useLoadFavorites';
import { useEffect } from 'react';
import { useLoadUserInfo } from './useLoadUserInfo';

export function useInitialAuthLoad() {
	const loadFavorites = useLoadFavorites();
	const loadCart = useLoadCart();
	const loadUserInfo = useLoadUserInfo();
	const userStore = useUserStore();

	useEffect(() => {
		console.log('useInitialAuthLoad');
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
}
