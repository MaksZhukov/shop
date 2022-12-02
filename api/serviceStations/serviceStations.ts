import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { ServiceStation } from './types';

export const fetchServiceStations = (
	params: CollectionParams,
	isServerRequest: boolean = false
) =>
	api.get<ApiResponse<ServiceStation[]>>('/service-stations', {
		params,
		headers: { isServerRequest },
	});

export const fetchServiceStation = (slug: string, isServerRequest = false) =>
	api.get<ApiResponse<ServiceStation>>(`/service-stations/${slug}`, {
		headers: { isServerRequest },
	});
