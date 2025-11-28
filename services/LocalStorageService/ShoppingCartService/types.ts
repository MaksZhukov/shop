import { ShoppingCart } from 'api/shopping-cart/types';
import { ProductType } from 'api/types';

export type StorageShoppingCart = Omit<ShoppingCart, 'product'> & {
	product: {
		id: number;
		type: ProductType;
	};
};

export interface ShoppingCartStorage {
	shoppingCart: StorageShoppingCart[];
}
