import type { Product, ProductType } from 'entities/product';

export type UserType = 'individual' | 'legal';
export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'online' | 'cash' | 'bank_transfer' | 'pickup' | 'receive_invoice';

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

export type OrderCheckoutParams = {
	products: { id: number; type: ProductType }[];
	file: File | null;
	paymentMethod: string;
	userName?: string;
	phone: string;
	email: string;
	address?: string;
	comment?: string;
	companyName?: string;
	userType: UserType;
	tin?: string;
};
