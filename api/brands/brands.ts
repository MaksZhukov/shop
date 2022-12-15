import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Brand } from './types';

export const fetchBrands = (params: CollectionParams) =>
	api.get<ApiResponse<Brand[]>>('/brands', {
		params,
	});

export const fetchBrandByName = (brandName: string, params: CollectionParams) =>
	api.get<ApiResponse<Brand>>(`/brands/${brandName}`, { params });
