import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage } from 'entities/page';
import { ServiceStationService, type ServiceStation } from 'entities/serviceStation';
import {
	ServiceStationsEntry,
	ServiceStationsInjector,
	ServiceStationsStore,
	SERVICE_STATIONS_QUERY
} from 'features/serviceStations';
import { createModuleInjector } from 'shared/di';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage;
	serviceStations: ServiceStation[];
}

export const inject = createModuleInjector<typeof ServiceStationsStore>();

const ServiceStationsPage = ({ page, serviceStations }: Props) => {
	const serviceStationsStore = inject(ServiceStationsStore);
	serviceStationsStore.syncFromServer(serviceStations);

	return (
		<ServiceStationsInjector value={{ serviceStationsStore, page }}>
			<ServiceStationsEntry />
		</ServiceStationsInjector>
	);
};

export default ServiceStationsPage;

export const getStaticProps = getPageProps(undefined, async () => {
	const container = createRequestContainer();
	const pageService = container.get(PageService);
	const serviceStationService = container.get(ServiceStationService);
	const page = (await pageService.fetchPage('service-station')()).data.data;

	return {
		props: {
			page,
			serviceStations: await serviceStationService.fetchServiceStations(SERVICE_STATIONS_QUERY),
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'СТО', href: '/service-stations' }
			]
		}
	};
});
