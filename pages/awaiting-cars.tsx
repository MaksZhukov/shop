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
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { fetchPageAwaitingCars } from 'api/pageAwaitingCars/pageAwaitingCars';
import { PageAwaitingCars } from 'api/pageAwaitingCars/types';

import { ApiResponse } from 'api/types';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import CarItem from 'components/CarItem';
import Filters from 'components/Filters';
import {
	BODY_STYLES,
	FUELS,
	TRANSMISSIONS,
} from 'components/Filters/constants';
import HeadSEO from 'components/HeadSEO';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';
import styles from './awaiting-cars.module.scss';

const DynamicNews = dynamic(() => import('components/News'));
const DynamicReviews = dynamic(() => import('components/Reviews(INACTIVE)'));

interface Props {
	data: PageAwaitingCars;
}

const AwaitingCars: NextPage<Props> = ({ data }) => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [cars, setCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<null | number>(null);
	const [pageCount, setPageCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);

	const {
		brandId = '',
		modelId = '',
		generationId = '',
		fuel = '',
		bodyStyle = '',
		transmission = '',
		page = '1',
	} = router.query as {
		brandId: string;
		modelId: string;
		generationId: string;
		sparePartId: string;
		fuel: string;
		bodyStyle: string;
		transmission: string;
		sort: string;
		page: string;
	};

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
				try {
					const {
						data: { data },
					} = await fetchFunc();
					setState(data);
				} catch (err) {
					enqueueSnackbar(
						'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку',
						{ variant: 'error' }
					);
				}
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
				disabled: !brandId,
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
				id: 'generationId',
				name: 'generationName',
				placeholder: 'Поколение',
				type: 'autocomplete',
				disabled: !modelId,
				options: generations.map((item) => ({
					label: item.name,
					...item,
				})),
				onOpen: handleOpenAutocomplete<Generation>(
					!!generations.length,
					setGenerations,
					() =>
						fetchGenerations({
							filters: { model: modelId as string },
							pagination: { limit: MAX_LIMIT },
						})
				),
				noOptionsText: noOptionsText,
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
					generation: generationId || undefined,
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
					}, undefined, {shallow: true});
				}
				setTotal(pagination.total);
			}
			setIsFirstDataLoaded(true);
		} catch (err) {
			enqueueSnackbar(
				'Произошла какая-то ошибка с загрузкой автомобилей, обратитесь в поддержку',
				{ variant: 'error' }
			);
		}
		setIsLoading(false);
	};
	useEffect(() => {
		fetchData();
	}, []);

	const handleChangePage = (_: any, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query }, undefined, {shallow: true});
	};

	return (
		<>
			<HeadSEO
				title={data.seo?.title || 'Ожидаемые авто'}
				description={data.seo?.description || 'Ожидаемые авто'}
				keywords={
					data.seo?.keywords ||
					'авто, ожидаемые авто, автомобили, ожидаемые автомобили'
				}></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' textAlign='center'>
						{data.seo?.h1 || 'Ожидаемые авто'}
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
						<DynamicReviews></DynamicReviews>
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
						<DynamicNews></DynamicNews>
					</Box>
				</Box>
				<SEOBox
					images={data.seo?.images}
					content={data.seo?.content}></SEOBox>
			</Container>
		</>
	);
};

export default AwaitingCars;

export const getStaticProps = getPageProps(fetchPageAwaitingCars);
