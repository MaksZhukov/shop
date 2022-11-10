import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageTires } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageTires = () =>
	api.get<ApiResponse<PageTires>>(`/page-tire`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
