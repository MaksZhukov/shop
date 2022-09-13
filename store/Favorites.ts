import { fetchSpareParts } from "api/spareParts/spareParts";
import { Product } from "api/types";
import { makeAutoObservable } from "mobx";
import {
  getFavoriteProductIDs,
  removeFavoriteProductID,
  saveFavoriteProductID,
} from "services/LocalStorageService";
import RootStore from ".";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "../api/favorites/favorites";
import { Favorite } from "../api/favorites/types";

export interface Favorites {
  items: any[];
}

export default class FavoritesStore implements Favorites {
  root: RootStore;

  items: Product[] = [];

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  async loadFavorites() {
    const {
      data: { data },
    } = await getFavorites();
    const items = await this.getFavoritesByLocalStorage(data);
    this.items = [...data.spareParts, ...items];
  }
  async getFavoritesByLocalStorage(userFavorites: Favorite) {
    let favoriteProductIDs = getFavoriteProductIDs();
    let uniqueFavoriteProductIDs = favoriteProductIDs.filter(
      (id) => !userFavorites.spareParts.some((item) => item.id === id)
    );
    if (!uniqueFavoriteProductIDs.length) {
      return [];
    }
    const {
      data: { data },
    } = await fetchSpareParts({
      filters: { id: uniqueFavoriteProductIDs },
      populate: ["images"],
    });
    return data;
  }
  async addFavorite(product: Product) {
    let favorite: Favorite | null = null;
    if (this.root.user.id) {
      let { data } = await addToFavorites(product.id);
      favorite = data.data;
    } else {
      saveFavoriteProductID(product.id);
    }
    this.items.push(product);
  }
  setFavorites(items: Product[]) {
    this.items = items;
  }
  async removeFavorite(productId: number, favoriteId: number) {
    let favoriteProductIDs = getFavoriteProductIDs();
    if (favoriteProductIDs.some((productID) => productID === productId)) {
      removeFavoriteProductID(productId);
    } else {
      await removeFromFavorites(favoriteId);
    }
    this.items = this.items.filter((el) => el.id !== productId);
  }
  clearFavorites() {
    let favoriteProductIDs = getFavoriteProductIDs();
    this.items = this.items.filter((item) =>
      favoriteProductIDs.some((productID) => productID === item.id)
    );
  }
}
