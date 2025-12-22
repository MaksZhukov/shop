import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireWidth } from './tireWidthTypes';

export const tireWidthApi = {
	fetchTireWidths: (params: CollectionParams) => api.get<ApiResponse<TireWidth[]>>('/tire-widths', { params })
};



