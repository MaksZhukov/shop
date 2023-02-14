import {
	Button,
	CircularProgress,
	Input,
	MenuItem,
	Pagination,
	PaginationItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import { fetchArticles } from 'api/articles/articles';
import { Brand } from 'api/brands/types';
import { Car } from 'api/cars/types';
import { API_MAX_LIMIT, API_UN_LIMIT } from 'api/constants';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';
import { ApiResponse } from 'api/types';
import Typography from 'components/Typography';
import { BODY_STYLES, FUELS, SEASONS, TRANSMISSIONS } from '../../constants';
import { NextPage } from 'next';
import { useSnackbar } from 'notistack';
import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import { fetchGenerations } from 'api/generations/generations';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { AxiosResponse } from 'axios';
import { fetchModels } from 'api/models/models';
import { getParamByRelation } from 'services/ParamsService';
import { fetchCars } from 'api/cars/cars';
import CarItem from 'components/CarItem';
import classNames from 'classnames';
import styles from './awaiting-cars.module.scss';
import { Box } from '@mui/system';
import Filters from 'components/Filters';
import MenuIcon from '@mui/icons-material/MenuSharp';
import GridViewIcon from '@mui/icons-material/GridViewSharp';
import ProductItem from 'components/ProductItem';

interface Props {
	page: DefaultPage;
	cars: ApiResponse<Car[]>;
	brands: Brand[];
}

const selectSortItems = [
	{ name: 'Новые', value: 'createdAt:desc' },
	{ name: 'Старые', value: 'createdAt:asc' },
	{ name: 'Дешевые', value: 'price:asc' },
	{ name: 'Дорогие', value: 'price:desc' },
];

const AwaitingCars: NextPage<Props> = ({ page, brands }) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [cars, setCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [volumes, setVolumes] = useState<EngineVolume[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
	const [isAutocompleteLoading, setIsAutocompleteLoading] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const filtersRef = useRef<any>(null);

	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const { qPage = '1', ...restQuery } = router.query as {
		page: string;
		[key: string]: string;
	};

	useEffect(() => {
		fetchData(restQuery);
	}, [qPage]);

	const noOptionsText = isAutocompleteLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const handleOpenAutocomplete =
		<T extends any>(
			hasData: boolean,
			setState: Dispatch<SetStateAction<T[]>>,
			fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
		) =>
		async () => {
			if (!hasData) {
				setIsAutocompleteLoading(true);
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
				setIsAutocompleteLoading(false);
			}
		};

	const handleChangeBrandAutocomplete = () => {
		setModels([]);
		setGenerations([]);
	};
	const filtersConfig = [
		[
			{
				id: 'brand',
				placeholder: 'Марка',
				disabled: false,
				type: 'autocomplete',
				onChange: handleChangeBrandAutocomplete,
				options: brands.map((item) => ({ label: item.name, value: item.slug })),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'model',
				placeholder: 'Модель',
				type: 'autocomplete',
				disabledDependencyId: 'brand',
				options: models.map((item) => item.name),
				onOpen: (values: { [key: string]: string | null }) =>
					handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
						fetchModels({
							filters: { brand: { slug: values.brand as string } },
							pagination: { limit: API_MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'generation',
				placeholder: 'Поколение',
				type: 'autocomplete',
				disabledDependencyId: 'model',
				options: generations.map((item) => item.name),
				onOpen: (values: { [key: string]: string | null }) =>
					handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
						fetchGenerations({
							filters: { model: { name: values.model as string } },
							pagination: { limit: API_MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'volume',
				placeholder: 'Обьем 2.0',
				type: 'autocomplete',
				options: volumes.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
						fetchEngineVolumes({
							pagination: { limit: API_MAX_LIMIT },
						})
					),
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

	const handleClickFind = (values: any) => {
		Object.keys(values).forEach((key) => {
			if (!values[key]) {
				delete router.query[key];
			} else {
				router.query[key] = values[key];
			}
		});
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
		fetchData(values);
	};

	const fetchData = async (values: any) => {
		setIsLoading(true);
		try {
			const {
				data: {
					data,
					meta: { pagination },
				},
			} = await fetchCars({
				filters: {
					brand: getParamByRelation(values.brand, 'slug'),
					model: getParamByRelation(values.Model),
					generation: getParamByRelation(values.generation),
					volume: getParamByRelation(values.volume),
					transmission: values.transmission,
					fuel: values.fuel,
					bodyStyle: values.bodyStyle,
				},
				pagination: { page: +qPage },
				populate: ['images', 'model', 'brand'],
			});
			setCars(data);
			if (pagination) {
				setPageCount(pagination.pageCount);
				setTotal(pagination.total);
				if (pagination.pageCount < +qPage) {
					router.query.page = (pagination.pageCount || 1).toString();
					router.push(
						{
							pathname: router.pathname,
							query: router.query,
						},
						undefined,
						{ shallow: true }
					);
				}
			}
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с загрузкой автомобилей, обратитесь в поддержку', {
				variant: 'error',
			});
		}
		setIsFirstDataLoaded(true);
		setIsLoading(false);
	};

	const handleClickChangeView = (view: 'grid' | 'list', position: 'top' | 'bottom') => () => {
		if (position === 'bottom') {
			window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
		}
		setActiveView(view);
	};

	const renderPagination = (
		<Pagination
			sx={{ flex: 1, display: 'flex', justifyContent: 'right' }}
			classes={{}}
			renderItem={(params) => (
				<NextLink
					shallow
					href={
						router.asPath.includes('page=')
							? `${router.asPath.replace(/page=\d/, `page=${params.page}`)}`
							: `${router.asPath}${router.asPath.includes('?') ? '&' : '?'}page=${params.page}`
					}
				>
					<PaginationItem
						{...params}
						onClick={() => {
							window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
						}}
					>
						{params.page}
					</PaginationItem>
				</NextLink>
			)}
			boundaryCount={1}
			page={+page}
			siblingCount={0}
			color='primary'
			count={pageCount}
			variant='text'
		/>
	);

	const renderBar = (position: 'top' | 'bottom') => (
		<Box display='flex' padding='0.5em' marginBottom='1em' bgcolor='#fff'>
			<Button
				variant='contained'
				onClick={handleClickChangeView('grid', position)}
				sx={{ bgcolor: activeView === 'grid' ? 'primary.main' : '#000' }}
				className={classNames(styles['btn-view'])}
			>
				<GridViewIcon fontSize='small' sx={{ color: '#fff' }}></GridViewIcon>
			</Button>
			<Button
				variant='contained'
				sx={{ bgcolor: activeView === 'list' ? 'primary.main' : '#000' }}
				onClick={handleClickChangeView('list', position)}
				className={classNames(styles['btn-view'])}
			>
				<MenuIcon fontSize='small' sx={{ color: '#fff' }}></MenuIcon>
			</Button>
			{pageCount > 1 && renderPagination}
		</Box>
	);
	return (
		<Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'initial' } }}>
			<Box marginTop='3.7em' marginRight='1em' component='aside' sx={{ width: { xs: '100%', md: '250px' } }}>
				<Filters ref={filtersRef} total={total} config={filtersConfig} onClickFind={handleClickFind}></Filters>
			</Box>
			<Box sx={{ width: { md: 'calc(100% - 250px - 2em)' } }}>
				<Typography marginBottom='0.5em' textTransform='uppercase' component='h1' variant='h4'>
					{page.seo?.h1}
				</Typography>
				{renderBar('top')}
				<Box
					display='flex'
					flexWrap='wrap'
					justifyContent='space-between'
					className={classNames(
						styles.items,
						isLoading && styles['loading'],
						!cars.length && styles['content-items_no-data']
					)}
				>
					{cars.length ? (
						cars.map((item) => (
							<CarItem
								width={activeView === 'grid' ? 280 : '100%'}
								height={activeView === 'grid' ? 280 : 150}
								dataFieldsToShow={[
									{
										name: 'Марка',
										value: item.brand?.name || '',
									},
									{
										name: 'Модель',
										value: item.model?.name || '',
									},
									{
										name: 'Год',
										value: new Date(item.manufactureDate).getFullYear().toString(),
									},
								]}
								activeView={activeView}
								key={item.id}
								data={item}
							></CarItem>
						))
					) : isFirstDataLoaded && !isLoading ? (
						<Typography textAlign='center' variant='h5'>
							Данных не найдено
						</Typography>
					) : (
						<CircularProgress></CircularProgress>
					)}
				</Box>
				{renderBar('bottom')}
			</Box>
		</Box>
	);
};

export default AwaitingCars;

export const getServerSideProps = getPageProps(fetchPage('awaiting-car'));
