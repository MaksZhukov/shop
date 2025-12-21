import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { WheelWidth } from './wheelWidthTypes';

export const wheelWidthApi = {
	fetchWheelWidths: (params?: CollectionParams) => api.get<ApiResponse<WheelWidth[]>>('/wheel-widths', { params })
};



