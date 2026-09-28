import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import type { CollectionParams } from 'shared/api/types';
import { SERVICE_STATION_API, ServiceStationApi } from './serviceStation.api';
import type { ServiceStationDto } from './dto/serviceStation.dto';
import type { ServiceStation } from './model/serviceStation.model';
import type { ServiceStationReader } from './ports/serviceStation.port';

const mapServiceStation = (serviceStation: ServiceStationDto): ServiceStation => ({ ...serviceStation });

@injectable()
export class ServiceStationService implements ServiceStationReader {
	constructor(@inject(SERVICE_STATION_API) private readonly serviceStationApi: ServiceStationApi) {}

	async fetchServiceStations(params: CollectionParams) {
		const { data } = await this.serviceStationApi.fetchServiceStations(params);
		return data.data.map(mapServiceStation);
	}

	async fetchServiceStation(slug: string) {
		const { data } = await this.serviceStationApi.fetchServiceStation(slug);
		return mapServiceStation(data.data);
	}
}
