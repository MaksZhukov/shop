import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireDiameter } from './model/tireDiameterModel';

export const tireDiameterApi = {
	fetchTireDiameters: (params: CollectionParams) =>
		api.get<ApiResponse<TireDiameter[]>>('/tire-diameters', { params })
};



