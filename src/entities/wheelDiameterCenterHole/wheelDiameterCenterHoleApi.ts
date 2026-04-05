import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiameterCenterHole } from './model/wheelDiameterCenterHoleModel';

export const wheelDiameterCenterHoleApi = {
	fetchWheelDiameterCenterHoles: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiameterCenterHole[]>>('/wheel-diameter-center-holes', { params })
};



