import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { WheelDiameterCenterHole } from './wheelDiameterCenterHoleTypes';

export const wheelDiameterCenterHoleApi = {
	fetchWheelDiameterCenterHoles: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiameterCenterHole[]>>('/wheel-diameter-center-holes', { params })
};



