import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageMain } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageMain = () =>
	api.get<ApiResponse<PageMain>>(`/page-main`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
