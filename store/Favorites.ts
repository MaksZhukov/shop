import { makeAutoObservable } from 'mobx';
import RootStore from '.';
import { getFavorites } from '../api/favorites/favorites';
import { Favorite } from '../api/favorites/types';

export interface Favorites {
	items: any[];
}

export default class FavoritesStore implements Favorites {
	root: RootStore;

	items: Favorite[] = [];

	constructor(root: RootStore) {
		this.root = root;
		makeAutoObservable(this);
	}
	async getFavorites() {
		const {
			data: { data },
		} = await getFavorites();
		this.items = data;
	}
	addFavorite(item: Favorite) {
		this.items.push(item);
	}
	removeFavorite(id: number) {
		this.items = this.items.filter((el) => el.id !== id);
	}
	clearFavorites() {
		this.items = [];
	}
}
