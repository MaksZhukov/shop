import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { TireWidth } from './types';

export const fetchTireWidths = (params: CollectionParams) =>
	api.get<ApiResponse<TireWidth[]>>('/tire-widths', { params });
