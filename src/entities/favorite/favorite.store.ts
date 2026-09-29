import 'reflect-metadata';
import { atom } from '@reatom/core';
import { injectable } from 'inversify';
import type { Favorite } from './model/favorite.model';

@injectable()
export class FavoriteStore {
	private readonly itemsAtom = atom<Favorite[]>([], 'favorite.items');

	get items() {
		return this.itemsAtom();
	}
	setItems(items: Favorite[]) {
		this.itemsAtom.set(items);
	}
	addItem(item: Favorite) {
		this.itemsAtom.set((items) => [...items, item]);
	}
	removeItem(favoriteId: number) {
		this.itemsAtom.set((items) => items.filter((item) => item.id !== favoriteId));
	}
	removeItems(favoriteIds: number[]) {
		this.itemsAtom.set((items) => items.filter((item) => !favoriteIds.includes(item.id)));
	}
	clearItems() {
		this.itemsAtom.set([]);
	}
}
