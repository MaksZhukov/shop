import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageSpareParts } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageMain = () =>
	api.get<ApiResponse<PageSpareParts>>(`/page-main`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
