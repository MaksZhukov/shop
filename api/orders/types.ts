import { Product } from 'api/types';

export type OrderCheckout = {
	token: string;
	redirect_url: string;
};

export type Order = {
	username: string;
	email: string;
	phone: string;
	transactionId: string;
	address: string;
	products: [{ product: Product }];
};
