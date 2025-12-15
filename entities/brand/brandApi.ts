import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Brand } from './brandTypes';

export const brandApi = {
	fetchBrands: (params: CollectionParams) =>
		api.get<ApiResponse<Brand[]>>('/brands', {
			params
		}),
	fetchBrandBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<Brand>>(`/brands/${slug}`, { params: { field: 'slug', ...params } })
};
