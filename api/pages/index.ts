import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { getRandomBackendLocalUrl } from 'services/BackendUrlService';
import { DefaultPage } from './types';

export const fetchPage =
	<T = DefaultPage>(pageUrl: string, params: CollectionParams = { populate: 'seo.images' }) =>
	() =>
		api.get<ApiResponse<T>>(`/page-${pageUrl}`, {
			params,
			baseURL: getRandomBackendLocalUrl() + '/api'
		});
