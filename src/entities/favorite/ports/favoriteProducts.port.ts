import type { Favorite } from '../model/favorite.model';
import type { StorageFavorite } from '../model/favoriteLocalStorage.model';

export const FAVORITE_PRODUCTS = Symbol('FavoriteProducts');

/** Loads current products for guest favorites. Implemented in `app`, because products live in other entities. */
export interface FavoriteProducts {
	findStored(items: StorageFavorite[]): Promise<{ found: Favorite[]; missingIds: number[] }>;
}
