import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Brand } from './types';

export const getBrands = (params: CollectionParams) =>
	api.get<ApiResponse<Brand[]>>('/brands', { params });
