import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireBrand } from './tireBrandTypes';

export const tireBrandApi = {
	fetchTireBrands: <T extends TireBrand>(params: CollectionParams) =>
		api.get<ApiResponse<T[]>>('/tire-brands', { params }),
	fetchTireBrandBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<TireBrand>>(`/tire-brands/${slug}`, { params })
};
