import { fetchSpareParts } from "api/spareParts/spareParts";
import { fetchTiers } from "api/tires/tires";
import { ApiResponse, CollectionParams, Product } from "api/types";
import { fetchWheels } from "api/wheels/wheels";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import {
  FavoriteLocalStorage,
  getFavoriteProductIDs,
  removeFavoriteProductID,
  saveFavoriteProductID,
} from "services/LocalStorageService";
import RootStore from ".";
import { changeFavorites, getFavorites } from "../api/favorites/favorites";
import { Favorite } from "../api/favorites/types";

export interface Favorites {
  items: any[];
  id: number;
}

export default class FavoritesStore implements Favorites {
  root: RootStore;
  id: number;
  items: Product[] = [];

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  transformItemsToFavorites() {
    return {
      sparePart: this.items
        .filter((item) => item.type === "sparePart")
        .map((item) => item.id),
      wheel: this.items
        .filter((item) => item.type === "wheel")
        .map((item) => item.id),
      tire: this.items
        .filter((item) => item.type === "tire")
        .map((item) => item.id),
    };
  }
  async loadFavorites() {
    const {
      data: {
        data: { id, tires = [], spareParts = [], wheels = [] },
      },
    } = await getFavorites();
    const [uniquSpareParts, uniqueWheels, uniqueTires] =
      await this.getItemsByLocalStorage(
        spareParts.map((item) => item.id),
        wheels.map((item) => item.id),
        tires.map((item) => item.id)
      );
    this.id = id;
    this.items = [
      ...spareParts,
      ...uniquSpareParts,
      ...wheels,
      ...uniqueWheels,
      ...tires,
      ...uniqueTires,
    ];
  }

  async getItemsByLocalStorage(
    sparePartsIds: number[] = [],
    wheelsIds: number[] = [],
    tiresIds: number[] = []
  ) {
    let favoriteProductIds = getFavoriteProductIDs();
    return await Promise.all([
      this.getUniqueItemsByLocalstorage(
        sparePartsIds,
        favoriteProductIds.sparePart,
        fetchSpareParts
      ),
      this.getUniqueItemsByLocalstorage(
        wheelsIds,
        favoriteProductIds.wheel,
        fetchWheels
      ),
      this.getUniqueItemsByLocalstorage(
        tiresIds,
        favoriteProductIds.tire,
        fetchTiers
      ),
    ]);
  }
  async getUniqueItemsByLocalstorage<T extends any>(
    productIds: number[],
    storageProductIds: number[],
    fetchFunc: (
      params: CollectionParams
    ) => Promise<AxiosResponse<ApiResponse<T[]>>>
  ) {
    let uniqueFavoriteProductIDs = productIds.filter(
      (id) => !storageProductIds.some((item) => item === id)
    );
    if (!uniqueFavoriteProductIDs.length) {
      return [];
    }
    const {
      data: { data },
    } = await fetchFunc({
      filters: { id: uniqueFavoriteProductIDs },
      populate: ["images"],
    });
    return data;
  }
  async addFavorite(product: Product) {
    this.items.push(product);
    if (this.root.user.id) {
      await changeFavorites(this.id, this.transformItemsToFavorites());
    } else {
      saveFavoriteProductID(product.type, product.id);
    }
  }
  setFavorites(items: Product[]) {
    this.items = items;
  }
  async removeFavorite(product: Product) {
    let favoriteProductIDs = getFavoriteProductIDs();
    console.log(favoriteProductIDs);
    if (
      favoriteProductIDs[product.type].some(
        (productID) => productID === product.id
      )
    ) {
      removeFavoriteProductID(product.type, product.id);
    } else {
      console.log("hello");
      await changeFavorites(this.id, favoriteProductIDs);
    }
    this.items = this.items.filter((el) => el.id !== product.id);
  }
  clearFavorites() {
    let favoriteProductIDs = getFavoriteProductIDs();
    this.items = this.items.filter((item) => {
      return Object.keys(favoriteProductIDs).filter((key) =>
        favoriteProductIDs[key as keyof FavoriteLocalStorage].some(
          (productId) => productId === item.id
        )
      );
    });
  }
}
