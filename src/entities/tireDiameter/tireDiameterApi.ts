import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { TireDiameterDto } from './dto/tireDiameter.dto';

export const tireDiameterApi = {
	fetchTireDiameters: (params: CollectionParams) =>
		api.get<ApiResponse<TireDiameterDto[]>>('/tire-diameters', { params })
};



