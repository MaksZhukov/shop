import { fetchCarOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import Car from 'components/Car';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: CarOnParts;
}

const CarOnPartsPage = ({ data }: Props) => {
	return <Car data={data}></Car>;
};

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	data: (await fetchCarOnParts(context.params?.slug as string)).data.data,
}));

export default CarOnPartsPage;
