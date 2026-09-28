import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireWidthDto } from './dto/tireWidth.dto';

export const tireWidthApi = {
	fetchTireWidths: (params: CollectionParams) => api.get<ApiResponse<TireWidthDto[]>>('/tire-widths', { params })
};



