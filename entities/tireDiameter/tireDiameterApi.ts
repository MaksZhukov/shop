import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { TireDiameter } from './tireDiameterTypes';

export const tireDiameterApi = {
	fetchTireDiameters: (params: CollectionParams) =>
		api.get<ApiResponse<TireDiameter[]>>('/tire-diameters', { params })
};



