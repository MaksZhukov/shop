import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { TireDiameter } from './types';

export const fetchTireDiameters = (params: CollectionParams) =>
	api.get<ApiResponse<TireDiameter[]>>('/tire-diameters', { params });
