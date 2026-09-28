import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { BrandDto } from './dto/brand.dto';

export const brandApi = {
	fetchBrands: <T extends BrandDto>(params: CollectionParams) =>
		api.get<ApiResponse<T[]>>('/brands', {
			params
		}),
	fetchBrandBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<BrandDto>>(`/brands/${slug}`, { params: { field: 'slug', ...params } })
};
