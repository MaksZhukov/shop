import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { ServiceStation } from './serviceStationTypes';

export const serviceStationApi = {
	fetchServiceStations: (params: CollectionParams) =>
		api.get<ApiResponse<ServiceStation[]>>('/service-stations', {
			params
		}),
	fetchServiceStation: (slug: string) => api.get<ApiResponse<ServiceStation>>(`/service-stations/${slug}`)
};



