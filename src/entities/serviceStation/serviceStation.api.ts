import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { ServiceStationDto } from './dto/serviceStation.dto';

export const SERVICE_STATION_API = Symbol('ServiceStationApi');

@injectable()
export class ServiceStationApi {
	fetchServiceStations(params: CollectionParams) {
		return api.get<ApiResponse<ServiceStationDto[]>>('/service-stations', {
			params
		});
	}

	fetchServiceStation(slug: string) {
		return api.get<ApiResponse<ServiceStationDto>>(`/service-stations/${slug}`);
	}
}
