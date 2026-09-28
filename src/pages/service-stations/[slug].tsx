import { createRequestContainer } from 'app/di/app.container';
import { ServiceStationService, ServiceStation as IServiceStation } from 'entities/serviceStation';
import { Card } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: IServiceStation;
}

const ServiceStation: NextPage<Props> = ({ page }) => <Card data={page}></Card>;

export default ServiceStation;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const serviceStationService = createRequestContainer().get(ServiceStationService);

	return {
		props: {
			page: (await serviceStationService.fetchServiceStation(context.params?.slug as string)).data.data
		}
	};
});
