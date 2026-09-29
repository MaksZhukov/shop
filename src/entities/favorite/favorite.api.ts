import type { Favorite } from './model/favorite.model';

/** Favorites storage. `RemoteFavoriteApi` for a signed-in user, `LocalFavoriteApi` for a guest. */
export interface FavoriteApi {
	load(): Promise<Favorite[]>;
	add(favorite: Favorite): Promise<Favorite>;
	remove(favorite: Favorite): Promise<void>;
}
