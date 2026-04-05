import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { ServiceStation } from './model/serviceStationModel';

export const serviceStationApi = {
	fetchServiceStations: (params: CollectionParams) =>
		api.get<ApiResponse<ServiceStation[]>>('/service-stations', {
			params
		}),
	fetchServiceStation: (slug: string) => api.get<ApiResponse<ServiceStation>>(`/service-stations/${slug}`)
};



