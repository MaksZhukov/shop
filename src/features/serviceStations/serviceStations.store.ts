import 'reflect-metadata';
import { atom, computed, withAsyncData, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import type { ServiceStation } from 'entities/serviceStation';
import { ServiceStationsService } from './serviceStations.service';

@injectable()
export class ServiceStationsStore {
	private readonly serverDataAtom = atom<ServiceStation[] | null>(null, 'serviceStations.serverData');

	readonly serviceStations = computed(async () => {
		const serverData = this.serverDataAtom();
		if (serverData !== null) {
			return serverData;
		}
		return await wrap(this.serviceStationsService.loadServiceStations());
	}, 'serviceStations.list').extend(withAsyncData({ initState: [] as ServiceStation[] }));

	constructor(@inject(ServiceStationsService) private readonly serviceStationsService: ServiceStationsService) {}

	syncFromServer(serviceStations: ServiceStation[]) {
		this.serverDataAtom.set(serviceStations);
	}
}
