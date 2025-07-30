import { Tune as TuneIcon } from '@mui/icons-material';
import GridViewIcon from '@mui/icons-material/GridViewSharp';
import MenuIcon from '@mui/icons-material/MenuSharp';
import {
	Button,
	CircularProgress,
	Input,
	MenuItem,
	Menu,
	Modal,
	Pagination,
	PaginationItem,
	Select,
	SelectChangeEvent,
	useMediaQuery
} from '@mui/material';
import { Box } from '@mui/material';
import { fetchCabins } from 'api/cabins/cabins';
import { API_DEFAULT_LIMIT } from 'api/constants';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { ApiResponse, CollectionParams, Product, SEO } from 'api/types';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import CarouselProducts from 'components/CarouselProducts';
import Filters from 'components/Filters';
import { AutocompleteType, NumberType } from 'components/Filters/types';
import ProductItem from 'components/ProductItem';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useThrottle } from 'rooks';
import { getCatalogAnchor, getCatalogAnchorText } from 'services/AnchorService';
const styles = {};

const COUNT_DAYS_FOR_NEW_PRODUCT = 70;

type SortItem = {
	value: string;
	name: string;
};

const selectSortItems = [
	{ value: 'createdAt:desc', name: 'Новые' },
	{ value: 'createdAt:asc', name: 'Старые' },
	{ value: 'price:asc', name: 'Дешёвые' },
	{ value: 'price:desc', name: 'Дорогие' }
];

const anchorText = {
	'spare-parts': 'запчасть',
	cabins: 'салон',
	wheels: 'диск'
};

import { ChevronDownIcon } from 'components/Icons';
import { Brand } from 'api/brands/types';
import { Link } from 'components/ui';

interface Props {
	seo: SEO | null;
	searchPlaceholder?: string;
	dataFieldsToShow?: { id: string; name: string }[];
	filtersConfig: (AutocompleteType | NumberType)[];
	kindSpareParts?: KindSparePart[];
	generateFiltersByQuery?: (filter: { [key: string]: string }, fetchFunc: any) => any;
	fetchData?: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>;
	fetchDataForSearch?: typeof fetchSpareParts | typeof fetchCabins;
	brands: Brand[];
	models: Model[];
	generations: Generation[];
}

let date = new Date();

const Catalog = ({
	fetchData,
	fetchDataForSearch,
	searchPlaceholder,
	dataFieldsToShow = [],
	kindSpareParts = [],
	filtersConfig,
	generateFiltersByQuery,
	seo,
	brands,
	models,
	generations
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
	const [isOpenFilters, setIsOpenFilters] = useState<boolean>(false);
	const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
	const filtersRef = useRef<any>(null);
	const [filtersValues, setFiltersValues] = useState<{ [key: string]: string | null }>({});
	const leaveRef = useRef<boolean>(false);
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const router = useRouter();

	const { enqueueSnackbar } = useSnackbar();

	const {
		searchValue: querySearchValue = '',
		sort = 'createdAt:desc',
		page = '1',
		kindSparePart,
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
	const catalogType = router.pathname.split('/')[1];

	const fetchProducts = async (
		{ searchValue, ...values }: any,
		paramPage?: number,
		withRouterPush: boolean = true
	) => {
		setIsLoading(true);
		if (fetchData) {
			try {
				const fetchsData = [fetchData];
				if (fetchDataForSearch && searchValue) {
					fetchsData.push(fetchDataForSearch);
				}
				const [
					{
						data: {
							data: responseData,
							meta: { pagination }
						}
					},
					dataForSearch
				] = await Promise.all(
					fetchsData.map((fetchFunc) =>
						fetchFunc({
							filters: {
								sold: false,
								...(searchValue
									? {
											$and: searchValue
												.split(' ')
												.map((word: string) => ({ h1: { $contains: word } }))
									  }
									: {}),
								...(generateFiltersByQuery ? generateFiltersByQuery(values, fetchFunc) : {})
							},
							pagination: searchValue
								? {}
								: { start: (paramPage ? paramPage - 1 : +page - 1) * API_DEFAULT_LIMIT },
							populate: [...dataFieldsToShow?.map((item) => item.id), 'images'],
							sort
						})
					)
				);

				const kindSparePart = kindSpareParts.find((item) => item.slug === values.kindSparePart);
				const shouldSwitchCatalog =
					(dataForSearch && responseData.length === 0 && !!dataForSearch.data.data.length) ||
					(kindSparePart?.type === 'cabin' && fetchDataForSearch === fetchCabins) ||
					(kindSparePart?.type === 'regular' && fetchDataForSearch === fetchSpareParts);

				const toSpareParts = fetchDataForSearch === fetchSpareParts;
				if (shouldSwitchCatalog) {
					router.push(
						{
							pathname: router.pathname.replace(
								toSpareParts ? 'cabins' : 'spare-parts',
								toSpareParts ? 'spare-parts' : 'cabins'
							),
							query: router.query
						},
						undefined,
						{ shallow: true }
					);
					return;
				} else {
					setData(responseData);
				}
				if (pagination) {
					setPageCount(Math.ceil(pagination.total / API_DEFAULT_LIMIT));
					if (paramPage) {
						router.query.page = '1';
					} else if (router.query.page && Math.ceil(pagination.total / API_DEFAULT_LIMIT) < +page) {
						router.query.page = (Math.ceil(pagination.total / API_DEFAULT_LIMIT) || 1).toString();
					}
					if (withRouterPush && !leaveRef.current) {
						router.push(
							{
								pathname: router.pathname,
								query: router.query
							},
							undefined,
							{ shallow: true }
						);
					}
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
	};

	const [throttledFetchProducts] = useThrottle(fetchProducts, 300);

	useEffect(() => {
		return () => {
			leaveRef.current = true;
		};
	}, []);

	useEffect(() => {
		if (router.isReady) {
			const fetchNewProducts = async () => {
				if (fetchData) {
					try {
						const response = await fetchData({
							sort: 'createdAt:desc',
							populate: ['images', 'brand'],
							pagination: { limit: API_DEFAULT_LIMIT / 2 },
							filters: {
								sold: {
									$eq: false
								},
								createdAt: {
									$gte: date.setDate(date.getDate() - COUNT_DAYS_FOR_NEW_PRODUCT)
								}
							}
						});
						setNewProducts(response.data.data);
					} catch (err) {
						enqueueSnackbar(
							'Произошла какая-то ошибка при загрузке новых продуктов, обратитесь в поддержку',
							{
								variant: 'error'
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
						[key]: othersQueryByFilters[key]
					}),
					{ searchValue: querySearchValue, brand, model, kindSparePart }
				)
			);
			setSearchValue(querySearchValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sort, page, brand, router.isReady]);

	const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setSortMenuAnchor(event.currentTarget);
	};

	const handleSortMenuClose = () => {
		setSortMenuAnchor(null);
	};

	const handleSortItemClick = (item: SortItem) => {
		router.query.sort = item.value;
		router.push({ pathname: router.pathname, query: router.query });
		setSortMenuAnchor(null);
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
		let hasNoKindSparePartChanges = newValues.kindSparePart === kindSparePart;
		let shallow = hasNoBrandChanges && hasNoModelChanges && hasNoKindSparePartChanges;
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

		if (router.query.page) {
			delete router.query.page;
		}

		throttledFetchProducts(newValues, 1, false);

		// It needs to avoid the same seo data for the page
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: shallow });
		// router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: shallow });
		setTimeout(() => {
			setIsClickedFind(false);
		}, 100);
		setIsClickedFind(true);

		if (isTablet) {
			setIsOpenFilters(false);
		}
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

	const handleClickAnchor = () => {
		let newQuery = {};
		if (brand && model && kindSparePart) {
			newQuery = { brand, model };
		} else if (brand && (model || kindSparePart)) {
			newQuery = { brand };
		}
		delete router.query.kindSparePart;
		throttledFetchProducts(
			Object.keys(othersQueryByFilters).reduce(
				(prev, key) => ({
					...prev,
					[key]: othersQueryByFilters[key]
				}),
				{ searchValue: querySearchValue, ...newQuery }
			),
			undefined,
			false
		);
	};

	const renderPagination = (position: 'bottom' | 'top') => (
		<Pagination
			sx={{
				flex: 1,
				display: { xs: position === 'top' ? 'none' : 'flex', md: 'flex' },
				justifyContent: { xs: 'center', md: 'right' }
			}}
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

	const handleClickBrand = (brandId: string) => {
		router.query.brand = brandId;
		router.push({ pathname: router.pathname, query: router.query });
	};

	return (
		<>
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				<Typography mb={1} variant='h6'>
					{seo?.h1}
				</Typography>{' '}
				<Button variant='text' endIcon={<ChevronDownIcon />} color='primary' onClick={handleSortMenuOpen}>
					{selectSortItems.find((item) => item.value === sort)?.name}
				</Button>
				<Menu
					disableScrollLock
					sx={{
						'& .MuiPaper-root': {
							bgcolor: '#fff',
							mt: -0.5
						}
					}}
					anchorEl={sortMenuAnchor}
					open={Boolean(sortMenuAnchor)}
					onClose={handleSortMenuClose}
				>
					{selectSortItems.map((item) => (
						<MenuItem
							key={item.name}
							onClick={() => handleSortItemClick(item)}
							selected={sort === item.value}
						>
							{item.name}
						</MenuItem>
					))}
				</Menu>
			</Box>

			<Box display='flex' gap={2}>
				<Box width={256} component='aside'>
					<Filters
						ref={filtersRef}
						total={total}
						config={filtersConfig}
						onClickFind={handleClickFind}
						values={filtersValues}
						setValues={setFiltersValues}
					></Filters>
				</Box>
				<Box flex={1}>
					{(!brand || !model) && (
						<Box
							mb={2}
							boxShadow='0px 10px 25px 0px #1018281F'
							px={2}
							py={4}
							minHeight={360}
							display='flex'
							flexDirection='column'
							flexWrap='wrap'
							height={360}
							gap={2}
							borderRadius={4}
							border='1px solid #D0D5DD'
							bgcolor='#EEEEEE'
						>
							{!brand &&
								brands.map((brand) => (
									<Box py={1} key={brand.id}>
										<Link href={`/spare-parts/${brand.slug}`}>{brand.name}</Link>
									</Box>
								))}
							{!model &&
								models.map((model) => (
									<>
										{model.generations?.map((generation) => (
											<Box py={1} key={generation.id}>
												<Link
													href={`/spare-parts/${brand}/model-${model.slug}?generation=${generation.slug}`}
												>
													{model.name} {generation.name}
												</Link>
											</Box>
										))}
									</>
								))}
						</Box>
					)}
					<Box
						display='flex'
						flexWrap='wrap'
						gap={{ xs: '1em', md: 0 }}
						justifyContent={{ xs: 'center', md: 'space-between' }}
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
									minHeight={activeView === 'grid' ? 390 : 150}
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
				</Box>
			</Box>

			<Box marginTop='2.5em'>
				<Typography>
					Возникла необходимость купить {seo?.h1} для Вашего «железного друга»? Затрудняетесь сделать
					правильный выбор между оригинальными запчастями или их аналогами? Мы предложим надежные,
					качественные бу запчасти для вашего авто. Покупку можно совершить прямо на нашем сайте в один клик.
					Наши менеджеры всегда на связи и помогут вам как с выбором, так и с консультацией.
				</Typography>
				<Typography marginTop='1em' gutterBottom component='h2' variant='h5'>
					{seo?.h1} купить с доставкой
				</Typography>
				<Typography gutterBottom>
					Авто разборка Дриблинг готова предложить вам качественный товар по доступной цене.
					<br />
					Товар снят с б/у автомобиля, проверен. На данный момент деталь отвечает техническим и эстетическим
					требованиям. Если хотите получить более детальную информацию - свяжитесь с нашим менеджером.{' '}
				</Typography>
				<Typography gutterBottom>
					Наши Запчасти б/у вы можете заказать с доставкой. Идеальна наша доставка отлажена в следующих
					городах Беларуси - Гродно, Минск, Брест, Гомель, Могилев, Витебск. Так же мы сообщаем, что работаем
					со всеми городами и деревнями, просто доставка займет немного больше времени. Будьте уверены, мы
					приложим все силы, что бы ваш товар был доставлен максимально быстро.
				</Typography>
			</Box>
		</>
	);
};

export default Catalog;
