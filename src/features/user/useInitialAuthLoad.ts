import { store } from 'app/providers/StoreProvider';
import { authLocalStorage } from 'entities/user/authLocalStorage';
import { useLoadCart } from 'features/cart/useLoadCart';
import { useLoadFavorites } from 'features/favorites/useLoadFavorites';
import { useEffect } from 'react';
import { useLoadUserInfo } from './useLoadUserInfo';
import { useSetJWT } from './useSetJWT';

export function useInitialAuthLoad(token?: string) {
	const loadFavorites = useLoadFavorites();
	const loadCart = useLoadCart();
	const setJWT = useSetJWT();
	const loadUserInfo = useLoadUserInfo();

	useEffect(() => {
		const tryFetchData = async () => {
			const effectiveToken = token ?? authLocalStorage.getJwt();

			if (effectiveToken) {
				setJWT(effectiveToken);
				try {
					await Promise.all([loadUserInfo(), loadCart(), loadFavorites()]);
				} catch {
					authLocalStorage.removeJwt();
				}
			} else {
				await Promise.all([loadCart(), loadFavorites()]);
			}
			store.setIsInitialRequestDone();
		};
		tryFetchData();
	}, [token, loadFavorites, loadCart, setJWT, loadUserInfo]);
}
