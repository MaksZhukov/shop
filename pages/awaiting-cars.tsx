import { Alert, Container, Pagination, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import CarItem from 'components/CarItem';
import Filters from 'components/Filters';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useStore } from '../store';
import styles from './awaiting-cars.module.scss';

const AwaitingCars = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const store = useStore();
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
		try {
			const {
				data: {
					data,
					meta: { pagination },
				},
			} = await fetchCars({
				filters: {},
				pagination: { page: +page },
				populate: ['images', 'model', 'brand'],
			});
			setCars(data);
			if (pagination) {
				setPageCount(pagination.pageCount);
				if (pagination.pageCount < +page) {
					router.query.page = (pagination.pageCount || 1).toString();
					router.push({
						pathname: router.pathname,
						query: router.query,
					});
				}
			}
		} catch (err) {
			store.notification.showMessage({
				content: (
					<Alert severity='error' variant='filled'>
						Произошла какая-то ошибка, обратитесь в поддержку
					</Alert>
				),
			});
		}
		setIsLoading(false);
	};
	useEffect(() => {
		fetchData();
	}, []);

	const handleChangePage = (_: any, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query });
	};

	return (
		<Container>
			<WhiteBox>
				<Typography component='h1' variant='h4' textAlign='center'>
					Ожидаемые авто
				</Typography>
			</WhiteBox>
			<Box className={styles.wrapper}>
				<Box marginRight='1em' className={styles.sider}>
					<Filters fetchData={fetchData}></Filters>
				</Box>
				<Box className={styles.content}>
					<WhiteBox>
						{cars.map((item) => (
							<CarItem key={item.id} data={item}></CarItem>
						))}
					</WhiteBox>
					<WhiteBox display='flex' justifyContent='center'>
						<Pagination
							page={+page}
							siblingCount={2}
							color='primary'
							count={pageCount}
							onChange={handleChangePage}
							variant='outlined'
						/>
					</WhiteBox>
				</Box>
			</Box>
		</Container>
	);
};

export default AwaitingCars;
