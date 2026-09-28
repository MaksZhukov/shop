import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelWidthDto } from './dto/wheelWidth.dto';

export const wheelWidthApi = {
	fetchWheelWidths: (params?: CollectionParams) => api.get<ApiResponse<WheelWidthDto[]>>('/wheel-widths', { params })
};



