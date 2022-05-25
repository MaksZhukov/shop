import { makeAutoObservable } from 'mobx';
import RootStore from '.';
import { getFavorites } from '../api/favorites/favorites';

export interface Favorites {
    items: any[];
}

export default class FavoritesStore implements Favorites {
    root: RootStore;

    items: any[] = [];

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
    clearFavorites() {
        this.items = [];
    }
}
