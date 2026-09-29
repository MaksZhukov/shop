import { reatomComponent } from '@reatom/react';
import { AsyncWrapper, WhiteBox } from 'shared/ui';
import { useDI } from '../serviceStations.di';
import { ServiceStationsHeader } from './serviceStationsHeader.component';
import { ServiceStationsList } from './serviceStationsList.component';
import { ServiceStationsLoading } from './serviceStationsLoading.component';

export const ServiceStationsEntry = reatomComponent(() => {
	const { serviceStationsStore, page } = useDI();
	const items = serviceStationsStore.serviceStations.data();
	const isLoading = !serviceStationsStore.serviceStations.ready() && items.length === 0;

	return (
		<WhiteBox>
			<ServiceStationsHeader title={page.seo?.h1 || 'СТО'} />
			<AsyncWrapper loading={isLoading} fallback={<ServiceStationsLoading />}>
				<ServiceStationsList serviceStations={items} />
			</AsyncWrapper>
		</WhiteBox>
	);
});
