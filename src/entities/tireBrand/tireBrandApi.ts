import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { TireBrand } from './tireBrandTypes';

export const tireBrandApi = {
	fetchTireBrands: (params: CollectionParams) => api.get<ApiResponse<TireBrand[]>>('/tire-brands', { params }),
	fetchTireBrandBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<TireBrand>>(`/tire-brands/${slug}`, { params })
};



