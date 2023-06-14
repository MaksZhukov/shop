import { fetchCar } from 'api/cars/cars';
import { Car as ICar } from 'api/cars/types';
import Car from 'components/Car';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: ICar;
}

const CarPage = ({ page }: Props) => {
	return <Car data={page}></Car>;
};

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	page: (await fetchCar(context.params?.slug as string)).data.data
}));

export default CarPage;
