import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { ProductType } from 'entities/product';
import { OrderCheckout, OrderCheckoutResponse } from './orderTypes';
import type { UserType } from 'features/orderRegistration';

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

const CHECKOUT_OPTIONAL_KEYS: (keyof Pick<
	OrderCheckoutParams,
	'userName' | 'address' | 'comment' | 'companyName' | 'tin'
>)[] = ['userName', 'address', 'comment', 'companyName', 'tin'];

function buildCheckoutFormData(params: OrderCheckoutParams): FormData {
	const formData = new FormData();
	formData.append('products', JSON.stringify(params.products));
	formData.append('userType', params.userType);
	formData.append('phone', params.phone);
	formData.append('email', params.email);
	formData.append('paymentMethod', params.paymentMethod);

	if (params.file) {
		formData.append('file', params.file, params.file.name);
	}

	for (const key of CHECKOUT_OPTIONAL_KEYS) {
		const value = params[key];
		if (value != null && value !== '') {
			formData.append(key, String(value));
		}
	}

	return formData;
}

export const orderApi = {
	fetchOrderCheckout: (products: { id: number; type: ProductType }[], paymentMethodType: string) =>
		api.get<ApiResponse<OrderCheckout>>(`/orders-v1/checkout`, {
			params: { products, paymentMethodType }
		}),

	checkout: (params: OrderCheckoutParams) => {
		return api.post<ApiResponse<OrderCheckoutResponse>>(`/orders-v1/checkout`, buildCheckoutFormData(params));
	}
};
