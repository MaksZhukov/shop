import { fetchSpareParts } from "api/spareParts/spareParts";
import { Product } from "api/types";
import { Tire } from "api/tires/types";
import { Wheel } from "api/wheels/types";
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

  items: Favorite[] = [];

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  async loadFavorites() {
    const {
      data: { data },
    } = await getFavorites();
    const items = await this.getFavoritesByLocalStorage(data);
    this.items = [...data, ...items];
  }
  async getFavoritesByLocalStorage(userFavorites: Favorite[] = []) {
    let favoriteProductIDs = getFavoriteProductIDs();
    let uniqueFavoriteProductIDs = favoriteProductIDs.filter(
      (id) => !userFavorites.some((item) => item.product.id === id)
    );
    if (!uniqueFavoriteProductIDs.length) {
      return [];
    }
    const {
      data: { data: products },
    } = await fetchSpareParts({
      filters: { id: uniqueFavoriteProductIDs },
      populate: ["images"],
    });
    let cartItems: Favorite[] = products.map((item) => ({
      id: new Date().getTime(),
      product: item,
    }));
    return cartItems;
  }
  async addFavorite(product: Product) {
    let favorite: Favorite | null = null;
    if (this.root.user.id) {
      let { data } = await addToFavorites(product.id);
      favorite = data.data;
    } else {
      favorite = { id: new Date().getTime(), product };
      saveFavoriteProductID(product.id);
    }
    this.items.push(favorite);
  }
  setFavorites(items: Favorite[]) {
    this.items = items;
  }
  async removeFavorite(productId: number, favoriteId: number) {
    let favoriteProductIDs = getFavoriteProductIDs();
    if (favoriteProductIDs.some((productID) => productID === productId)) {
      removeFavoriteProductID(productId);
    } else {
      await removeFromFavorites(favoriteId);
    }
    this.items = this.items.filter((el) => el.product.id !== productId);
  }
  clearFavorites() {
    let favoriteProductIDs = getFavoriteProductIDs();
    this.items = this.items.filter((item) =>
      favoriteProductIDs.some((productID) => productID === item.product.id)
    );
  }
}
