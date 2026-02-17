import type { Product } from 'entities/product';

export type OrderCheckout = {
	token: string;
	redirect_url: string;
};

export type OrderCheckoutResponse = {
	order: Order;
	checkout?: OrderCheckout;
};

export type OrderReissueCheckoutTokenResponse = {
	checkout: OrderCheckout;
};

export type Order = {
	username: string;
	email: string;
	phone: string;
	transactionId: string;
	address: string;
	products: [{ product: Product }];
	createdAt: string;
	id: number;
};
