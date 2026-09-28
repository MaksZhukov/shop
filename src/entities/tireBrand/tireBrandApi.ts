import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireBrandDto } from './dto/tireBrand.dto';

export const tireBrandApi = {
	fetchTireBrands: <T extends TireBrandDto>(params: CollectionParams) =>
		api.get<ApiResponse<T[]>>('/tire-brands', { params }),
	fetchTireBrandBySlug: (slug: string, params: CollectionParams) =>
		api.get<ApiResponse<TireBrandDto>>(`/tire-brands/${slug}`, { params })
};
