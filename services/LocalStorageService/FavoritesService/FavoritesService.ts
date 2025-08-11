import { Favorite } from 'api/favorites/types';
import { BaseStorageService } from '../BaseStorageService';
import { StorageFavorite } from './types';

export class FavoritesService extends BaseStorageService {
	private readonly FAVORITES_KEY = 'favoriteProducts';

	getFavorites(): StorageFavorite[] {
		return this.getItem(this.FAVORITES_KEY, []);
	}

	saveFavorite(favorite: Favorite): void {
		const favorites = this.getFavorites();
		const storageFavorite: StorageFavorite = {
			...favorite,
			product: {
				id: favorite.product.id,
				type: favorite.product.type
			}
		};

		const existingIndex = favorites.findIndex((item) => item.id === favorite.id);
		if (existingIndex >= 0) {
			favorites[existingIndex] = storageFavorite;
		} else {
			favorites.push(storageFavorite);
		}

		this.saveFavorites(favorites);
	}

	removeFavorite(favorite: Favorite): void {
		const favorites = this.getFavorites();
		const filteredFavorites = favorites.filter((item) => item.id !== favorite.id);
		this.saveFavorites(filteredFavorites);
	}

	removeFavorites(favoritesIDs: number[]): void {
		const favorites = this.getFavorites();
		const filteredFavorites = favorites.filter((item) => !favoritesIDs.includes(item.id));
		this.saveFavorites(filteredFavorites);
	}

	clearFavorites(): void {
		this.removeItem(this.FAVORITES_KEY);
	}

	hasFavorite(favoriteId: number): boolean {
		const favorites = this.getFavorites();
		return favorites.some((item) => item.id === favoriteId);
	}

	getFavoritesCount(): number {
		return this.getFavorites().length;
	}

	private saveFavorites(favorites: StorageFavorite[]): void {
		this.setItem(this.FAVORITES_KEY, favorites);
	}
}
