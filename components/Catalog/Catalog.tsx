import {
	Button,
	CircularProgress,
	Input,
	Link,
	MenuItem,
	Pagination,
	PaginationItem,
	Select,
	SelectChangeEvent,
	useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { useThrottle } from 'rooks';
import { ApiResponse, CollectionParams, Product, SEO } from 'api/types';
import classNames from 'classnames';
import Filters from 'components/Filters';
import { AutocompleteType, NumberType } from 'components/Filters/types';
import ProductItem from 'components/ProductItem';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useEffect, useState, useRef, ReactNode, KeyboardEvent } from 'react';
import NextLink from 'next/link';
import LinkWithImage from 'components/LinkWithImage';
import MenuIcon from '@mui/icons-material/MenuSharp';
import GridViewIcon from '@mui/icons-material/GridViewSharp';
import Typography from 'components/Typography';
import { AxiosResponse } from 'axios';
import CarouselProducts from 'components/CarouselProducts';

import styles from './Catalog.module.scss';
import { API_DEFAULT_LIMIT } from 'api/constants';

const COUNT_DAYS_FOR_NEW_PRODUCT = 70;

const selectSortItems = [
	{ name: 'Новые', value: 'createdAt:desc' },
	{ name: 'Старые', value: 'createdAt:asc' },
	{ name: 'Дешевые', value: 'price:asc' },
	{ name: 'Дорогие', value: 'price:desc' },
];

interface Props {
	seo: SEO | null;
	searchPlaceholder?: string;
	dataFieldsToShow?: { id: string; name: string }[];
	filtersConfig: (AutocompleteType | NumberType)[][];
	generateFiltersByQuery?: (filter: { [key: string]: string }) => any;
	fetchData?: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>;
}

let date = new Date();

const Catalog = ({
	fetchData,
	searchPlaceholder,
	dataFieldsToShow = [],
	filtersConfig,
	generateFiltersByQuery,
	seo,
}: Props) => {
	const [newProducts, setNewProducts] = useState<Product[]>([]);
	const [data, setData] = useState<Product[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isClickedFind, setIsClickedFind] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [pageCount, setPageCount] = useState<number>(0);
	const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
	const filtersRef = useRef<any>(null);
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

	const router = useRouter();

	const { enqueueSnackbar } = useSnackbar();

	const {
		searchValue: querySearchValue = '',
		sort = 'createdAt:desc',
		page = '1',
		slug,
		...othersQuery
	} = router.query as {
		searchValue: string;
		sort: string;
		page: string;
		[key: string]: string;
	};
	const flatFiltersConfig = filtersConfig.flat();
	const othersQueryByFilters = Object.keys(othersQuery).reduce(
		(prev, curr) =>
			flatFiltersConfig.find((item) => item.id === curr) ? { ...prev, [curr]: othersQuery[curr] } : prev,
		{} as { [key: string]: string }
	);

	const [brand, modelParam] = slug || [];
	const model = modelParam ? modelParam.replace('model-', '') : modelParam;

	const [throttledFetchProducts] = useThrottle(async ({ searchValue, ...values }: any, paramPage?: number) => {
		setIsLoading(true);
		if (fetchData) {
			try {
				const {
					data: {
						data: responseData,
						meta: { pagination },
					},
				} = await fetchData({
					filters: {
						price: { $gt: 0 },
						...(searchValue ? { h1: { $contains: searchValue } } : {}),
						...(generateFiltersByQuery ? generateFiltersByQuery(values) : {}),
					},
					pagination: searchValue ? {} : { start: (paramPage || +page) * API_DEFAULT_LIMIT },
					populate: [...dataFieldsToShow?.map((item) => item.id), 'images'],
					sort,
				});
				setData(responseData);
				if (pagination) {
					setPageCount(Math.ceil(pagination.total / API_DEFAULT_LIMIT));
					if (paramPage) {
						router.query.page = '1';
					} else if (Math.ceil(pagination.total / API_DEFAULT_LIMIT) < +page) {
						router.query.page = (Math.ceil(pagination.total / API_DEFAULT_LIMIT) || 1).toString();
					}
					router.push(
						{
							pathname: router.pathname,
							query: router.query,
						},
						undefined,
						{ shallow: true }
					);
					setTotal(pagination.total);
				}
				setIsFirstDataLoaded(true);
			} catch (err) {
				enqueueSnackbar(
					'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		}
		setIsLoading(false);
	}, 300);

	useEffect(() => {
		if (router.isReady) {
			const fetchNewProducts = async () => {
				if (fetchData) {
					try {
						const response = await fetchData({
							sort: 'createdAt:desc',
							populate: ['images', 'brand'],
							filters: {
								price: {
									$gt: 0,
								},
								createdAt: {
									$gte: date.setDate(date.getDate() - COUNT_DAYS_FOR_NEW_PRODUCT),
								},
							},
						});
						setNewProducts(response.data.data);
					} catch (err) {
						enqueueSnackbar(
							'Произошла какая-то ошибка при загрузке новых продуктов, обратитесь в поддержку',
							{
								variant: 'error',
							}
						);
					}
				}
			};
			fetchNewProducts();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

	useEffect(() => {
		if (router.isReady && !isClickedFind) {
			throttledFetchProducts(
				Object.keys(othersQueryByFilters).reduce(
					(prev, key) => ({
						...prev,
						[key]: othersQueryByFilters[key],
					}),
					{ searchValue: querySearchValue, brand, model }
				)
			);
			setSearchValue(querySearchValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sort, page, brand, router.isReady]);

	const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleChangeSort = (e: SelectChangeEvent<HTMLInputElement>) => {
		router.query.sort = e.target.value as string;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleClickFind = (values: { [key: string]: string | null }) => {
		let newValues: { [key: string]: string } = { ...values, searchValue };

		let hasNoBrandChanges =
			(newValues.brand && brand && newValues.brand === brand) || (!newValues.brand && !brand) ? true : false;
		let hasNoModelChanges =
			(newValues.model && model && newValues.model === model.replace('model-', '')) ||
			(!newValues.model && !model)
				? true
				: false;
		let shallow = hasNoBrandChanges && hasNoModelChanges;
		Object.keys(newValues).forEach((key) => {
			if (!newValues[key]) {
				if (key === 'brand' && !newValues['model']) {
					delete router.query.slug;
				} else {
					delete router.query[key];
				}
			}
		});
		Object.keys(newValues).forEach((key) => {
			if (newValues[key]) {
				if (key === 'brand') {
					router.query['slug'] = [newValues[key]];
					delete router.query[key];
				} else if (key === 'model') {
					(router.query['slug'] as string[]).push('model-' + newValues[key]);
					delete router.query[key];
				} else {
					router.query[key] = newValues[key];
				}
			}
		});

		throttledFetchProducts(newValues, 1);
		// It needs to avoid the same seo data for the page
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: shallow });
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: shallow });
		setTimeout(() => {
			setIsClickedFind(false);
		}, 100);
		setIsClickedFind(true);
	};

	const handleClickChangeView = (view: 'grid' | 'list', position: 'top' | 'bottom') => () => {
		if (position === 'bottom') {
			window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
		}
		setActiveView(view);
	};

	const handleKeyDown = (position: 'top' | 'bottom') => (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			filtersRef.current.onClickFind();
			if (position === 'bottom') {
				window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
			}
		}
	};

	const renderPagination = (
		<Pagination
			sx={{ flex: 1, display: 'flex', justifyContent: 'right' }}
			classes={{}}
			renderItem={(params) =>
				params.page === null ? (
					<PaginationItem
						{...params}
						onClick={() => {
							window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
						}}
					>
						{params.page}
					</PaginationItem>
				) : (
					<NextLink
						shallow
						href={
							router.asPath.includes('page=')
								? `${router.asPath.replace(/page=\d+/, `page=${params.page}`)}`
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
				)
			}
			boundaryCount={1}
			page={+page}
			siblingCount={1}
			color='primary'
			count={pageCount}
			variant='text'
		/>
	);

	const renderBar = (position: 'top' | 'bottom') => (
		<Box display='flex' padding='0.5em 0 0.5em 0.5em' marginBottom='1em' bgcolor='#fff'>
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

			<Input
				className={styles['search']}
				sx={{ bgcolor: '#fff', maxWidth: 200, marginRight: '0.5em', paddingLeft: '0.5em' }}
				onChange={handleChangeSearch}
				onKeyDown={handleKeyDown(position)}
				value={searchValue}
				placeholder={searchPlaceholder}
			></Input>
			<Select
				variant='standard'
				MenuProps={{ disableScrollLock: true }}
				value={sort as any}
				sx={{ maxWidth: 200 }}
				className={styles['sort-select']}
				onChange={handleChangeSort}
			>
				{selectSortItems.map((item) => (
					<MenuItem key={item.name} value={item.value}>
						{item.name}
					</MenuItem>
				))}
			</Select>
			{renderPagination}
		</Box>
	);

	return (
		<>
			<Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'initial' } }}>
				<Box marginTop='3.7em' marginRight='1em' component='aside' sx={{ width: { xs: '100%', md: '250px' } }}>
					<Filters
						ref={filtersRef}
						total={total}
						config={filtersConfig}
						onClickFind={handleClickFind}
					></Filters>
				</Box>
				<Box sx={{ width: { md: 'calc(100% - 250px - 2em)' } }}>
					<Typography marginBottom='0.5em' textTransform='uppercase' component='h1' variant='h4'>
						{seo?.h1}
					</Typography>
					{renderBar('top')}
					<Box
						display='flex'
						flexWrap='wrap'
						justifyContent='space-between'
						className={classNames(
							styles.items,
							isLoading && styles['loading'],
							!data.length && styles['content-items_no-data']
						)}
					>
						{data.length ? (
							data.map((item) => (
								<ProductItem
									width={activeView === 'grid' ? 280 : '100%'}
									height={activeView === 'grid' ? 350 : 150}
									dataFieldsToShow={dataFieldsToShow || []}
									activeView={activeView}
									key={item.id}
									data={item}
								></ProductItem>
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
			{!!newProducts.length && (
				<CarouselProducts
					data={newProducts}
					title={
						<Typography withSeparator fontWeight='bold' marginBottom='1em' marginTop='1em' variant='h5'>
							ВАМ СТОИТ ОБРАТИТЬ ВНИМАНИЕ
						</Typography>
					}
				></CarouselProducts>
			)}
		</>
	);
};

export default Catalog;
