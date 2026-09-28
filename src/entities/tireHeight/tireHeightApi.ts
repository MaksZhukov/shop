import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireHeightDto } from './dto/tireHeight.dto';

export const tireHeightApi = {
	fetchTireHeights: (params: CollectionParams) => api.get<ApiResponse<TireHeightDto[]>>('/tire-heights', { params })
};
