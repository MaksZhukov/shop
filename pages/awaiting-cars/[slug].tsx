import { fetchCar } from 'api/cars/cars';
import { Car as ICar } from 'api/cars/types';
import Car from 'components/Car';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: ICar;
}

const CarPage = ({ data }: Props) => {
	return <Car data={data}></Car>;
};

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	data: (await fetchCar(context.params?.slug as string)).data.data,
}));

export default CarPage;
