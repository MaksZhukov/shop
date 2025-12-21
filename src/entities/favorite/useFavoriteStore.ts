import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { FavoriteStore } from './favoriteStore';

export const useFavoriteStore = (): FavoriteStore => {
	const { store } = useContext(MobXProviderContext) as { store: { favorites: FavoriteStore } };
	return store.favorites;
};
