import type { ServiceStation } from 'entities/serviceStation';
import { ServiceStationItem } from './serviceStationItem.component';

type ServiceStationsListProps = {
	serviceStations: ServiceStation[];
};

export const ServiceStationsList = ({ serviceStations }: ServiceStationsListProps) => (
	<>
		{serviceStations.map((serviceStation) => (
			<ServiceStationItem key={serviceStation.id} serviceStation={serviceStation} />
		))}
	</>
);
