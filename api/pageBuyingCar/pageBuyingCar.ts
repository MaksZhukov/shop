import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageBuyingCar } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageBuyingCar = () =>
	api.get<ApiResponse<PageBuyingCar>>(`/page-buying-car`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
