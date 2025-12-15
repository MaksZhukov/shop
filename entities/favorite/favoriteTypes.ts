import type { Product } from 'entities/product';

export interface Favorite {
	id: number;
	product: Product;
}
