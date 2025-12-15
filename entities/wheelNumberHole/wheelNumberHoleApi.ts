import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { WheelNumberHole } from './wheelNumberHoleTypes';

export const wheelNumberHoleApi = {
	fetchWheelNumberHoles: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelNumberHole[]>>('/wheel-disk-offsets', { params })
};



