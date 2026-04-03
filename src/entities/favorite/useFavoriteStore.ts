import { useContext } from 'react';
import { FavoriteStore } from './favoriteStore';
import { FavoriteStoreContext } from './favoriteContext';

export const useFavoriteStore = (): FavoriteStore => {
	const favoriteStore = useContext(FavoriteStoreContext);
	if (!favoriteStore) {
		throw new Error('FavoriteStore not found');
	}
	return favoriteStore;
};
