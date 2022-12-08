import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { ServiceStation } from './types';

export const fetchServiceStations = (params: CollectionParams) =>
	api.get<ApiResponse<ServiceStation[]>>('/service-stations', {
		params,
	});

export const fetchServiceStation = (slug: string) => api.get<ApiResponse<ServiceStation>>(`/service-stations/${slug}`);
