import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { TireHeight } from './tireHeightTypes';

export const tireHeightApi = {
	fetchTireHeights: (params: CollectionParams) => api.get<ApiResponse<TireHeight[]>>('/tire-heights', { params })
};
