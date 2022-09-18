import {
	Alert,
	CircularProgress,
	Container,
	Pagination,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { fetchBrands } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';

import { ApiResponse } from 'api/types';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import CarItem from 'components/CarItem';
import Filters from 'components/Filters';
import { arrayOfYears } from 'components/Filters/config';
import {
	BODY_STYLES,
	FUELS,
	TRANSMISSIONS,
} from 'components/Filters/constants';
import News from 'components/News';
import Reviews from 'components/Reviews';
import WhiteBox from 'components/WhiteBox';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useStore } from '../store';
import styles from './awaiting-cars.module.scss';

const AwaitingCars = () => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
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

	const arrayOfYearsFrom = yearTo
		? arrayOfYears.filter((value) => +value <= +yearTo)
		: arrayOfYears;
	const arrayOfYearsTo = yearFrom
		? arrayOfYears.filter((value) => +value >= +yearFrom)
		: arrayOfYears;

	const noOptionsText = isLoading ? (
		<CircularProgress size={20} />
	) : (
		<>Совпадений нет</>
	);

	const handleOpenAutocomplete =
		<T extends any>(
			hasData: boolean,
			setState: Dispatch<SetStateAction<T[]>>,
			fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
		) =>
		async () => {
			if (!hasData) {
				setIsLoading(true);
				const {
					data: { data },
				} = await fetchFunc();
				setState(data);
				setIsLoading(false);
			}
		};

	const filtersConfig = [
		[
			{
				id: 'brandId',
				name: 'brandName',
				placeholder: 'Марка',
				disabled: false,
				type: 'autocomplete',
				options: brands.map((item) => ({ label: item.name, ...item })),
				onOpen: handleOpenAutocomplete<Brand>(
					!!brands.length,
					setBrands,
					() =>
						fetchBrands({
							pagination: { limit: MAX_LIMIT },
						})
				),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'modelId',
				name: 'modelName',
				placeholder: 'Модель',
				type: 'autocomplete',
				disabled: true,
				options: models.map((item) => ({ label: item.name, ...item })),
				onOpen: handleOpenAutocomplete<Model>(
					!!models.length,
					setModels,
					() =>
						fetchModels({
							filters: { brand: brandId as string },
							pagination: { limit: MAX_LIMIT },
						})
				),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'yearFrom',
				placeholder: 'Год от',
				type: 'autocomplete',
				disabled: false,
				options: arrayOfYearsFrom,
			},
			{
				id: 'yearTo',
				placeholder: 'Год до',
				type: 'autocomplete',
				disabled: false,
				options: arrayOfYearsTo,
			},
		],
		[
			{
				id: 'volume',
				placeholder: 'Обьем 2.0',
				type: 'number',
				disabled: false,
			},
		],
		[
			{
				id: 'bodyStyle',
				placeholder: 'Кузов',
				type: 'autocomplete',
				disabled: false,
				options: BODY_STYLES,
			},
		],
		[
			{
				id: 'transmission',
				placeholder: 'Коробка',
				type: 'autocomplete',
				disabled: false,
				options: TRANSMISSIONS,
			},
		],
		[
			{
				id: 'fuel',
				placeholder: 'Тип топлива',
				type: 'autocomplete',
				disabled: false,
				options: FUELS,
			},
		],
	];

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
							styles.sider_left,
							isTablet && styles.sider_tablet
						)}>
						<Filters
							config={filtersConfig}
							total={total}
							fetchData={fetchData}></Filters>
						<Reviews></Reviews>
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
							styles.sider_right,
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
