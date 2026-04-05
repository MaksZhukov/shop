import type { Cart } from './cartModel';
import type { ProductType } from 'entities/product';

export type StorageCart = Omit<Cart, 'product'> & {
	product: {
		id: number;
		type: ProductType;
	};
};

export interface CartStorage {
	cart: StorageCart[];
}
