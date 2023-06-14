import { fetchServiceStation } from 'api/serviceStations/serviceStations';
import { ServiceStation as IServiceStation } from 'api/serviceStations/types';
import Card from 'components/Card';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
interface Props {
	page: IServiceStation;
}

const ServiceStation: NextPage<Props> = ({ page }) => <Card data={page}></Card>;

export default ServiceStation;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	page: (await fetchServiceStation(context.params?.slug as string)).data.data
}));
