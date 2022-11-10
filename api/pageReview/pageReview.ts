import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageReview } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageReview = () =>
	api.get<ApiResponse<PageReview>>(`/page-review`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
