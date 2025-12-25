import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { ProductType } from 'entities/product';
import { OrderCheckout, OrderCheckoutResponse } from './orderTypes';

export const orderApi = {
	fetchOrderCheckout: (products: { id: number; type: ProductType }[], paymentMethodType: string) =>
		api.get<ApiResponse<OrderCheckout>>(`/orders/checkout`, {
			params: {
				products,
				paymentMethodType
			}
		}),
	checkout: ({
		products,
		paymentMethod,
		userName,
		phone,
		email,
		address
	}: {
		products: { id: number; type: ProductType }[];
		paymentMethod: string;
		userName: string;
		phone: string;
		email: string;
		address: string;
	}) =>
		api.post<ApiResponse<OrderCheckoutResponse>>(`/orders/checkout-v1`, {
			data: {
				products,
				paymentMethod,
				userName,
				phone,
				email,
				address
			}
		})
};
