import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import Filters from 'components/Filters';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './awaiting-cars.module.scss';

const AwaitingCars = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const {
		brandId = '',
		modelId = '',
		fuel = '',
		bodyStyle = '',
		transmission = '',
		sort = 'createdAt:desc',
		page = '1',
	} = router.query as {
		brandId: string;
		modelId: string;
		sparePartId: string;
		fuel: string;
		bodyStyle: string;
		transmission: string;
		sort: string;
		page: string;
	};

	const fetchData = async () => {
		setIsLoading(true);
		const {
			data: {
				data,
				meta: { pagination },
			},
		} = await fetchCars({
			filters: {},
			pagination: { page: +page },
			populate: ['images', 'model', 'brand'],
			// sort,
		});
		setCars(data);
		setIsLoading(false);
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Container>
			<WhiteBox>
				<Typography component='h1' variant='h4' textAlign='center'>
					Ожидаемые авто
				</Typography>
			</WhiteBox>
			<Box className={styles.sider}>
				<Filters fetchData={fetchData}></Filters>
			</Box>
			<Box></Box>
		</Container>
	);
};

export default AwaitingCars;
