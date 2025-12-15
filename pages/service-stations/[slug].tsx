import { serviceStationApi, ServiceStation as IServiceStation } from 'entities/serviceStation';
import { Card } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
interface Props {
	page: IServiceStation;
}

const ServiceStation: NextPage<Props> = ({ page }) => <Card data={page}></Card>;

export default ServiceStation;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	props: {
		page: (await serviceStationApi.fetchServiceStation(context.params?.slug as string)).data.data
	}
}));
