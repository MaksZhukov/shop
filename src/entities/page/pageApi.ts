import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import { getRandomBackendLocalUrl } from 'shared/services/BackendUrlService';
import type { DefaultPage } from './pageTypes';

export const pageApi = {
	fetchPage:
		<T = DefaultPage>(pageUrl: string, params: CollectionParams = { populate: 'seo.images' }) =>
		() =>
			api.get<ApiResponse<T>>(`/page-${pageUrl}`, {
				params,
				baseURL: getRandomBackendLocalUrl() + '/api'
			})
};



