import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { TireBrand } from './types';

export const fetchTireBrands = (params: CollectionParams) =>
	api.get<ApiResponse<TireBrand[]>>('/tire-brands', { params });
