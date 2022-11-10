import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageWheels } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageWheels = () =>
	api.get<ApiResponse<PageWheels>>(`/page-wheel`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
