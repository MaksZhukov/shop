import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageMain } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageProduct = () =>
	api.get<ApiResponse<PageMain>>(`/page-product`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
