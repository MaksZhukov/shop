import type { ServiceStation } from 'entities/serviceStation';
import { CardItem } from 'shared/ui';

type ServiceStationItemProps = {
	serviceStation: ServiceStation;
};

export const ServiceStationItem = ({ serviceStation }: ServiceStationItemProps) => (
	<CardItem
		name={serviceStation.name}
		description={serviceStation.description}
		image={serviceStation.image}
		link={`/service-stations/${serviceStation.slug}`}
	></CardItem>
);
