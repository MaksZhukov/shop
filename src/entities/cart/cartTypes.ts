import type { Product } from 'entities/product';

export interface Cart {
	id: number;
	product: Product;
}

export type ApiCartProduct = {
	id: number;
	product: Product;
	__component: string;
};

export type ApiCart = {
	id: number;
	uid: string;
	createdAt: string;
	updatedAt: string;
	product: [ApiCartProduct];
};
