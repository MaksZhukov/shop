import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageSpareParts } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageSpareParts = () =>
	api.get<ApiResponse<PageSpareParts>>(`/page-spare-parts`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
