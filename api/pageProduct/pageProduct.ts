import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageProduct } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageProduct = () =>
	api.get<ApiResponse<PageProduct>>(`/page-product`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
