import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiameterDto } from './dto/wheelDiameter.dto';

export const wheelDiameterApi = {
	fetchWheelDiameters: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiameterDto[]>>('/wheel-diameters', { params })
};



