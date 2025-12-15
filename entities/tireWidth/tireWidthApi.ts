import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { TireWidth } from './tireWidthTypes';

export const tireWidthApi = {
	fetchTireWidths: (params: CollectionParams) => api.get<ApiResponse<TireWidth[]>>('/tire-widths', { params })
};



