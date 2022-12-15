import { ServiceStation as IServiceStation } from 'api/serviceStations/types';
import { fetchServiceStation } from 'api/serviceStations/serviceStations';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import Card from 'components/Card';
interface Props {
	data: IServiceStation;
}

const ServiceStation: NextPage<Props> = ({ data }) => <Card data={data}></Card>;

export default ServiceStation;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	data: (await fetchServiceStation(context.params?.slug as string)).data.data,
}));
