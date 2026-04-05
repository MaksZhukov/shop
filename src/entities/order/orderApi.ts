import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { ProductType } from 'entities/product';
import { backendUrl } from 'shared/services/EnvService';
import {
	OrderCheckout,
	OrderCheckoutResponse,
	OrderReissueCheckoutTokenResponse,
	OrderCheckoutParams
} from './model/orderModel';

const CANCEL_ORDER_URL = `${backendUrl}/api/orders-v1/cancel`;

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
	},
	reissueCheckoutToken: (checkoutToken: string, orderId: number) => {
		return api.post<ApiResponse<OrderReissueCheckoutTokenResponse>>(`/orders-v1/reissue-checkout-token`, {
			token: checkoutToken,
			orderId
		});
	},
	cancelOrder: (checkoutToken: string) => {
		return api.post<ApiResponse<OrderCheckoutResponse>>(`/orders-v1/cancel`, { token: checkoutToken });
	},

	/** Fire-and-forget cancel via sendBeacon (for pagehide/beforeunload when fetch is unreliable). */
	cancelOrderBeacon: (checkoutToken: string): void => {
		if (typeof navigator.sendBeacon !== 'function') return;
		const payload = JSON.stringify({ token: checkoutToken });
		navigator.sendBeacon(CANCEL_ORDER_URL, new Blob([payload], { type: 'application/json' }));
	}
};
