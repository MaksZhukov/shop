import { atom } from '@reatom/core';
import type { Favorite } from './model/favorite.model';

const itemsAtom = atom<Favorite[]>([], 'favorite.items');
const isLoadingAtom = atom(false, 'favorite.isLoading');

export const favoriteStore = {
	get items() {
		return itemsAtom();
	},
	get isLoading() {
		return isLoadingAtom();
	},
	setItems(items: Favorite[]) {
		itemsAtom.set(items);
	},
	setIsLoading(isLoading: boolean) {
		isLoadingAtom.set(isLoading);
	},
	addItem(item: Favorite) {
		itemsAtom.set((items) => [...items, item]);
	},
	removeItem(favoriteId: number) {
		itemsAtom.set((items) => items.filter((item) => item.id !== favoriteId));
	},
	removeItems(favoriteIds: number[]) {
		itemsAtom.set((items) => items.filter((item) => !favoriteIds.includes(item.id)));
	},
	clearItems() {
		itemsAtom.set([]);
	}
};
