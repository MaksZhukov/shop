import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelNumberHole } from './model/wheelNumberHoleModel';

export const wheelNumberHoleApi = {
	fetchWheelNumberHoles: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelNumberHole[]>>('/wheel-disk-offsets', { params })
};
