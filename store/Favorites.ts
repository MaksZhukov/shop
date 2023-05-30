import { fetchCabins } from 'api/cabins/cabins';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchTires } from 'api/tires/tires';
import { ApiResponse, CollectionParams, Product } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import {
    clearFavorites,
    getFavorites,
    removeFavorite as removeFavoriteLS,
    saveFavorite,
    StorageFavorite
} from 'services/LocalStorageService';
import RootStore from '.';
import { removeFavorite, addFavorite, fetchFavorites, removeFavorites } from '../api/favorites/favorites';
import { Favorite } from '../api/favorites/types';

export interface Favorites {
    items: Favorite[];
}

export default class FavoritesStore implements Favorites {
    root: RootStore;
    items: Favorite[] = [];

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }
    async loadFavorites() {
        if (this.root.user.jwt) {
            const {
                data: { data }
            } = await fetchFavorites();
            runInAction(() => {
                this.items = data;
            });
        } else {
            const favorites = getFavorites();
            try {
                const [spareParts, wheels, tires, cabins] = await Promise.all([
                    this.getFavoritesByTypes(
                        favorites.filter((item) => item.product.type === 'sparePart'),
                        fetchSpareParts
                    ),
                    this.getFavoritesByTypes(
                        favorites.filter((item) => item.product.type === 'wheel'),
                        fetchWheels
                    ),
                    this.getFavoritesByTypes(
                        favorites.filter((item) => item.product.type === 'tire'),
                        fetchTires
                    ),
                    this.getFavoritesByTypes(
                        favorites.filter((item) => item.product.type === 'cabin'),
                        fetchCabins
                    )
                ]);

                runInAction(() => {
                    this.items = [...spareParts, ...wheels, ...tires, ...cabins];
                });
            } catch (err) {
                console.error(err);
            }
        }
    }
    async getFavoritesByTypes(
        favorites: StorageFavorite[],
        fetchFunc: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>
    ) {
        let result: Favorite[] = [];
        if (favorites.length) {
            const {
                data: { data }
            } = await fetchFunc({
                filters: { id: favorites.map((item) => item.product.id), sold: { $eq: false } },
                populate: ['images', 'brand']
            });
            result = favorites.map((item) => ({
                ...item,
                product: data.find((el) => el.id === item.product.id) as Product
            }));
        }
        return result;
    }
    async addFavorite(favorite: Favorite) {
        if (this.root.user.id) {
            try {
                let {
                    data: { data }
                } = await addFavorite(favorite.product.id, favorite.product.type);
                runInAction(() => {
                    this.items.push(data);
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            saveFavorite(favorite);
            runInAction(() => {
                this.items.push(favorite);
            });
        }
    }
    async removeFavorite(favorite: Favorite) {
        if (this.root.user.id) {
            await removeFavorite(favorite.id);
        } else {
            removeFavoriteLS(favorite);
        }
        runInAction(() => {
            this.items = this.items.filter((el) => el.id !== favorite.id);
        });
    }
    async clearFavorites() {
        if (this.root.user.id) {
            await removeFavorites(this.items.map((item) => item.id));
        } else {
            clearFavorites();
        }
        this.items = [];
    }
}
