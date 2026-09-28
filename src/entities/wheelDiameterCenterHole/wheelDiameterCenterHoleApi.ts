import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiameterCenterHoleDto } from './dto/wheelDiameterCenterHole.dto';

export const wheelDiameterCenterHoleApi = {
	fetchWheelDiameterCenterHoles: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiameterCenterHoleDto[]>>('/wheel-diameter-center-holes', { params })
};



