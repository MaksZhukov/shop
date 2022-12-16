import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import getConfig from 'next/config';
import { DefaultPage } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPage =
	<T = DefaultPage>(pageUrl: string, params: CollectionParams<T> = { populate: 'seo.images' }) =>
	() =>
		api.get<ApiResponse<T>>(`/page-${pageUrl}`, {
			params,
			baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
		});
