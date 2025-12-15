import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { ProductType } from 'entities/product';
import { OrderCheckout } from './orderTypes';

export const orderApi = {
	fetchOrderCheckout: (products: { id: number; type: ProductType }[], paymentMethodType: string) =>
		api.get<ApiResponse<OrderCheckout>>(`/orders/checkout`, {
			params: {
				products,
				paymentMethodType
			}
		})
};
