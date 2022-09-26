import { Product } from 'api/types';

export interface ShoppingCartItem {
	id: number;
	uid: string;
	product: Product;
}
