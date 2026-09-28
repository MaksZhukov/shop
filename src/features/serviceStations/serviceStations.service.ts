import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ServiceStationService } from 'entities/serviceStation';
import { SnackbarService } from 'shared/services';
import { SERVICE_STATIONS_QUERY } from './serviceStations.constants';

const LOAD_ERROR = 'Произошла какая-то ошибка с загрузкой СТО, обратитесь в поддержку';

@injectable()
export class ServiceStationsService {
	constructor(
		@inject(ServiceStationService) private readonly serviceStationService: ServiceStationService,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}

	async loadServiceStations() {
		try {
			return await this.serviceStationService.fetchServiceStations(SERVICE_STATIONS_QUERY);
		} catch {
			this.snackbarService.error(LOAD_ERROR);
			throw new Error(LOAD_ERROR);
		}
	}
}
