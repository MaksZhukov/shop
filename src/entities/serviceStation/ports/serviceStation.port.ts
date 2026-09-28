import type { CollectionParams } from 'shared/api/types';
import type { ServiceStation } from '../model/serviceStation.model';

export interface ServiceStationReader {
	fetchServiceStations(params: CollectionParams): Promise<ServiceStation[]>;
	fetchServiceStation(slug: string): Promise<ServiceStation>;
}
