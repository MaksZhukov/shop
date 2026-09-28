import type { ServiceStationApi } from '../serviceStation.api';

export type ServiceStationReader = Pick<ServiceStationApi, 'fetchServiceStations' | 'fetchServiceStation'>;
