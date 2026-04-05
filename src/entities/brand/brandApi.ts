import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Brand } from './model/brandModel';

export const brandApi = {
	fetchBrands: <T extends Brand>(params: CollectionParams) =>
		api.get<ApiResponse<T[]>>('/brands', {
			params
		}),
	fetchBrandBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<Brand>>(`/brands/${slug}`, { params: { field: 'slug', ...params } })
};
