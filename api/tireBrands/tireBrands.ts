import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { TireBrand } from './types';

export const fetchTireBrands = (params: CollectionParams) =>
	api.get<ApiResponse<TireBrand[]>>('/tire-brands', { params });

export const fetchTireBrandBySlug = (slug: string, params: CollectionParams) =>
	api.get<ApiResponse<TireBrand>>(`/tire-brands/${slug}`, { params });
