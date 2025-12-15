import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { WheelDiameter } from './wheelDiameterTypes';

export const wheelDiameterApi = {
	fetchWheelDiameters: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiameter[]>>('/wheel-diameters', { params })
};



