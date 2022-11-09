import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { Review } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageReview = () =>
	api.get<ApiResponse<Review>>(`/page-review`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
