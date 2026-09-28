import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { SERVICE_STATION_API, ServiceStationApi } from './serviceStation.api';
import type { ServiceStationReader } from './ports/serviceStation.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class ServiceStationService implements ServiceStationReader {
	constructor(@inject(SERVICE_STATION_API) private readonly serviceStationApi: ServiceStationApi) {}

	fetchServiceStations(params: CollectionParams) {
		return this.serviceStationApi.fetchServiceStations(params);
	}

	fetchServiceStation(slug: string) {
		return this.serviceStationApi.fetchServiceStation(slug);
	}
}
