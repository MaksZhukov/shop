import {
	Alert,
	Container,
	Pagination,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import classNames from 'classnames';
import CarItem from 'components/CarItem';
import Filters from 'components/Filters';
import News from 'components/News';
import WhiteBox from 'components/WhiteBox';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useStore } from '../store';
import styles from './awaiting-cars.module.scss';

const AwaitingCars = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<null | number>(null);
	const [pageCount, setPageCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const router = useRouter();
	const store = useStore();

	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);

	const {
		brandId = '',
		modelId = '',
		fuel = '',
		bodyStyle = '',
		transmission = '',
		yearFrom = '',
		yearTo = '',
		page = '1',
	} = router.query as {
		yearFrom: string;
		yearTo: string;
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
				filters: {
					brand: brandId || undefined,
					model: modelId || undefined,
					year: {
						$gte: yearFrom || undefined,
						$lte: yearTo || undefined,
					},
					transmission: transmission || undefined,
					fuel: fuel || undefined,
					bodyStyle: bodyStyle || undefined,
				},
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
				setTotal(pagination.total);
			}
			setIsFirstDataLoaded(true);
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
		<>
			<Head>
				<title>Ожидаемые авто</title>
			</Head>

			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' textAlign='center'>
						Ожидаемые авто
					</Typography>
				</WhiteBox>
				<Box
					className={classNames(
						styles.wrapper,
						isTablet && styles.wrapper_tablet
					)}>
					<Box
						marginRight='1em'
						className={classNames(
							styles.sider,
							isTablet && styles.sider_tablet
						)}>
						<Filters total={total} fetchData={fetchData}></Filters>
					</Box>
					<Box
						marginRight='1em'
						className={classNames(
							styles.content,
							isTablet && styles.content_tablet
						)}>
						<WhiteBox
							className={classNames(
								isLoading && styles.loading,
								!cars.length && styles['content-items_no-data']
							)}>
							{!!cars.length ? (
								cars.map((item) => (
									<CarItem
										key={item.id}
										data={item}></CarItem>
								))
							) : isFirstDataLoaded && !isLoading ? (
								<Typography textAlign='center' variant='h5'>
									Данных не найдено
								</Typography>
							) : (
								<></>
							)}
						</WhiteBox>
						{!!cars.length && (
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
						)}
					</Box>
					<Box
						component='aside'
						className={classNames(
							styles.sider,
							isTablet && styles.sider_tablet
						)}>
						<News></News>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default AwaitingCars;
