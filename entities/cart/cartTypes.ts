import type { Product } from 'entities/product';

export interface Cart {
	id: number;
	product: Product;
}
