import type { Favorite } from './favoriteTypes';
import type { ProductType } from 'entities/product';

export type StorageFavorite = Omit<Favorite, 'product'> & {
	product: {
		id: number;
		type: ProductType;
	};
};

export interface FavoritesStorage {
	favorites: StorageFavorite[];
}
