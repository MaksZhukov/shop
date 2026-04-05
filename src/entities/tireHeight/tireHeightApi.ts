import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireHeight } from './model/tireHeightModel';

export const tireHeightApi = {
	fetchTireHeights: (params: CollectionParams) => api.get<ApiResponse<TireHeight[]>>('/tire-heights', { params })
};
