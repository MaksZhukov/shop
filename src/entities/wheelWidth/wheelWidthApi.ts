import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelWidth } from './model/wheelWidthModel';

export const wheelWidthApi = {
	fetchWheelWidths: (params?: CollectionParams) => api.get<ApiResponse<WheelWidth[]>>('/wheel-widths', { params })
};



