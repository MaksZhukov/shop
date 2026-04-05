import { makeAutoObservable } from 'mobx';
import type { Favorite } from './model/favoriteModel';

export class FavoriteStore {
	items: Favorite[] = [];
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setItems(items: Favorite[]) {
		this.items = items;
	}

	setIsLoading(isLoading: boolean) {
		this.isLoading = isLoading;
	}

	addItem(item: Favorite) {
		this.items.push(item);
	}

	removeItem(favoriteId: number) {
		this.items = this.items.filter((el) => el.id !== favoriteId);
	}

	removeItems(favoritesIDs: number[]) {
		this.items = this.items.filter((el) => !favoritesIDs.includes(el.id));
	}

	clearItems() {
		this.items = [];
	}
}
