import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageShippingAndPayment } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageShippingAndPayment = () =>
	api.get<ApiResponse<PageShippingAndPayment>>(`/page-shipping-and-payment`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
