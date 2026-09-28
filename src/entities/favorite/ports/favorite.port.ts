import type { FavoriteApi } from '../favorite.api';

export type FavoriteReader = Pick<FavoriteApi, 'fetchFavorites' | 'addFavorite' | 'removeFavorite' | 'removeFavorites'>;
