import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { TireHeight } from './types';

export const fetchTireHeights = (params: CollectionParams) =>
	api.get<ApiResponse<TireHeight[]>>('/tire-heights', { params });
