import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import getConfig from 'next/config';
import { getRandomBackendLocalUrl } from 'services/BackendUrlService';
import { DefaultPage } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPage =
	<T = DefaultPage>(pageUrl: string, params: CollectionParams = { populate: 'seo.images' }) =>
	() =>
		api.get<ApiResponse<T>>(`/page-${pageUrl}`, {
			params,
			baseURL: getRandomBackendLocalUrl() + '/api'
		});
