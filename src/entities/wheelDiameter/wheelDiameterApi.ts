import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiameter } from './wheelDiameterTypes';

export const wheelDiameterApi = {
	fetchWheelDiameters: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiameter[]>>('/wheel-diameters', { params })
};



