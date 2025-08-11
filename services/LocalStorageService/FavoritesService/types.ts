import { Favorite } from 'api/favorites/types';
import { ProductType } from 'api/types';

export type StorageFavorite = Omit<Favorite, 'product'> & {
	product: {
		id: number;
		type: ProductType;
	};
};

export interface FavoritesStorage {
	favorites: StorageFavorite[];
}
