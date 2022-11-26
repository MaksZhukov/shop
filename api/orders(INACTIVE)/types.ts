import { Product } from 'api/types';

export interface Order {
	id: number;
	username: string;
	email?: string;
	address: string;
	phone: string;
	products: Product[];
}
