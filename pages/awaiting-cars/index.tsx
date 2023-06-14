import { Tune as TuneIcon } from '@mui/icons-material';
import GridViewIcon from '@mui/icons-material/GridViewSharp';
import MenuIcon from '@mui/icons-material/MenuSharp';
import { Button, CircularProgress, Modal, Pagination, PaginationItem, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { Brand } from 'api/brands/types';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { API_MAX_LIMIT } from 'api/constants';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { ApiResponse } from 'api/types';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import CarItem from 'components/CarItem';
import Filters from 'components/Filters';
import Typography from 'components/Typography';
import { BODY_STYLES_SLUGIFY, FUELS_SLUGIFY, SLUGIFY_FUELS, TRANSMISSIONS_SLUGIFY } from 'config';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { getParamByRelation } from 'services/ParamsService';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from '../../constants';
import styles from './awaiting-cars.module.scss';

interface Props {
	page: DefaultPage;
	cars: ApiResponse<Car[]>;
	brands: Brand[];
}

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
	const [isOpenFilters, setIsOpenFilters] = useState<boolean>(false);
	const filtersRef = useRef<any>(null);

	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

	const { qPage = '1', ...restQuery } = router.query as {
		page: string;
		[key: string]: string;
	};

	useEffect(() => {
		if (!models.length && restQuery.model) {
			handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
				fetchModels({
					filters: { brand: { slug: restQuery.brand } },
					pagination: { limit: API_MAX_LIMIT }
				})
			)();
		}
	}, [restQuery.model]);

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
						data: { data }
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
				noOptionsText: noOptionsText
			}
		],
		[
			{
				id: 'model',
				placeholder: 'Модель',
				type: 'autocomplete',
				disabledDependencyId: 'brand',
				options: models.map((item) => ({ label: item.name, value: item.slug })),
				onOpen: (values: { [key: string]: string | null }) =>
					handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
						fetchModels({
							filters: { brand: { slug: values.brand as string } },
							pagination: { limit: API_MAX_LIMIT }
						})
					),
				noOptionsText: noOptionsText
			}
		],
		[
			{
				id: 'generation',
				placeholder: 'Поколение',
				type: 'autocomplete',
				disabledDependencyId: 'model',
				options: generations.map((item) => ({ label: item.name, value: item.slug })),
				onOpen: (values: { [key: string]: string | null }) =>
					handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
						fetchGenerations({
							filters: { model: { slug: values.model as string }, brand: { slug: values.brand } },
							pagination: { limit: API_MAX_LIMIT }
						})
					),
				noOptionsText: noOptionsText
			}
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
							pagination: { limit: API_MAX_LIMIT }
						})
					)
			}
		],
		[
			{
				id: 'bodyStyle',
				placeholder: 'Кузов',
				type: 'autocomplete',
				disabled: false,
				options: BODY_STYLES.map((item) => ({ label: item, value: BODY_STYLES_SLUGIFY[item] }))
			}
		],
		[
			{
				id: 'transmission',
				placeholder: 'Коробка',
				type: 'autocomplete',
				disabled: false,
				options: TRANSMISSIONS.map((item) => ({ label: item, value: TRANSMISSIONS_SLUGIFY[item] }))
			}
		],
		[
			{
				id: 'fuel',
				placeholder: 'Тип топлива',
				type: 'autocomplete',
				disabled: false,
				options: FUELS.map((item) => ({ label: item, value: FUELS_SLUGIFY[item] }))
			}
		]
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
		if (isTablet) {
			setIsOpenFilters(false);
		}
	};

	const fetchData = async (values: any) => {
		setIsLoading(true);
		try {
			const {
				data: {
					data,
					meta: { pagination }
				}
			} = await fetchCars({
				filters: {
					brand: getParamByRelation(values.brand, 'slug'),
					model: getParamByRelation(values.model),
					generation: getParamByRelation(values.generation, 'slug'),
					volume: getParamByRelation(values.volume),
					transmission: values.transmission,
					fuel: SLUGIFY_FUELS[values.fuel],
					bodyStyle: values.bodyStyle
				},
				pagination: { page: +qPage },
				populate: ['images', 'model', 'brand']
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
							query: router.query
						},
						undefined,
						{ shallow: true }
					);
				}
			}
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с загрузкой автомобилей, обратитесь в поддержку', {
				variant: 'error'
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

	const handleClickOpenFilters = () => {
		setIsOpenFilters(true);
	};

	const handleCloseFilters = () => {
		setIsOpenFilters(false);
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
		<Box gap={'0.25em'} display='flex' padding='0.5em' marginBottom='1em' bgcolor={{ xs: 'initial', md: '#fff' }}>
			{position === 'top' && (
				<Button
					sx={{ display: { xs: 'flex', md: 'none' } }}
					variant='contained'
					onClick={handleClickOpenFilters}
					startIcon={<TuneIcon></TuneIcon>}
				>
					Параметры
				</Button>
			)}
			<Modal open={isOpenFilters} onClose={handleCloseFilters}>
				<Box padding='1em' bgcolor='#f1f2f6'>
					<Filters
						ref={filtersRef}
						total={total}
						config={filtersConfig}
						onClickFind={handleClickFind}
					></Filters>
				</Box>
			</Modal>
			<Button
				variant='contained'
				onClick={handleClickChangeView('grid', position)}
				sx={{
					bgcolor: activeView === 'grid' ? 'primary.main' : '#000',
					display: { xs: position === 'bottom' ? 'none' : 'flex', md: 'flex' }
				}}
				className={classNames(styles['btn-view'])}
			>
				<GridViewIcon fontSize='small' sx={{ color: '#fff' }}></GridViewIcon>
			</Button>
			<Button
				variant='contained'
				sx={{
					bgcolor: activeView === 'list' ? 'primary.main' : '#000',
					display: { xs: position === 'bottom' ? 'none' : 'flex', md: 'flex' }
				}}
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
			<Box
				marginTop='3.7em'
				marginRight='1em'
				component='aside'
				display={{ xs: 'none', md: 'block' }}
				sx={{ width: { xs: '100%', md: '250px' } }}
			>
				<Filters ref={filtersRef} total={total} config={filtersConfig} onClickFind={handleClickFind}></Filters>
			</Box>
			<Box sx={{ width: { md: 'calc(100% - 250px - 2em)' } }}>
				<Box
					marginBottom='0.5em'
					marginTop='0'
					textTransform='uppercase'
					component='h1'
					typography={{ xs: 'h5', md: 'h4' }}
				>
					{page.seo?.h1}
				</Box>
				{renderBar('top')}
				<Box
					display='flex'
					flexWrap='wrap'
					gap={'0.5em'}
					justifyContent={{ xs: 'center', md: 'space-between' }}
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
								minHeight={activeView === 'grid' ? 280 : 150}
								dataFieldsToShow={[
									{
										name: 'Марка',
										value: item.brand?.name || ''
									},
									{
										name: 'Модель',
										value: item.model?.name || ''
									},
									{
										name: 'Год',
										value: new Date(item.manufactureDate).getFullYear().toString()
									}
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
