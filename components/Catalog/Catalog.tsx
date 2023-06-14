import { Tune as TuneIcon } from '@mui/icons-material';
import GridViewIcon from '@mui/icons-material/GridViewSharp';
import MenuIcon from '@mui/icons-material/MenuSharp';
import {
	Button,
	CircularProgress,
	Input,
	Link,
	MenuItem,
	Modal,
	Pagination,
	PaginationItem,
	Select,
	SelectChangeEvent,
	useMediaQuery
} from '@mui/material';
import { Box } from '@mui/system';
import { Brand } from 'api/brands/types';
import { API_DEFAULT_LIMIT } from 'api/constants';
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
import styles from './Catalog.module.scss';

const COUNT_DAYS_FOR_NEW_PRODUCT = 70;

const selectSortItems = [
	{ name: 'Новые', value: 'createdAt:desc' },
	{ name: 'Старые', value: 'createdAt:asc' },
	{ name: 'Дешевые', value: 'price:asc' },
	{ name: 'Дорогие', value: 'price:desc' }
];

const anchorText = {
	'spare-parts': 'запчасть',
	cabins: 'салон',
	wheels: 'диск'
};

interface Props {
	seo: SEO | null;
	searchPlaceholder?: string;
	brands: Brand[];
	dataFieldsToShow?: { id: string; name: string }[];
	filtersConfig: (AutocompleteType | NumberType)[][];
	generateFiltersByQuery?: (filter: { [key: string]: string }) => any;
	fetchData?: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>;
}

let date = new Date();

const Catalog = ({
	fetchData,
	brands,
	searchPlaceholder,
	dataFieldsToShow = [],
	filtersConfig,
	generateFiltersByQuery,
	seo
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
	const filtersRef = useRef<any>(null);
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
				const {
					data: {
						data: responseData,
						meta: { pagination }
					}
				} = await fetchData({
					filters: {
						sold: { $eq: false },
						...(searchValue
							? { $and: searchValue.split(' ').map((word: string) => ({ h1: { $contains: word } })) }
							: {}),
						...(generateFiltersByQuery ? generateFiltersByQuery(values) : {})
					},
					pagination: searchValue
						? {}
						: { start: (paramPage ? paramPage - 1 : +page - 1) * API_DEFAULT_LIMIT },
					populate: [...dataFieldsToShow?.map((item) => item.id), 'images'],
					sort
				});
				setData(responseData);
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

	const handleClickOpenFilters = () => {
		setIsOpenFilters(true);
	};

	const handleCloseFilters = () => {
		setIsOpenFilters(false);
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
						}}>
						{params.page}
					</PaginationItem>
				) : (
					<NextLink
						shallow
						href={
							router.asPath.includes('page=')
								? `${router.asPath.replace(/page=\d+/, `page=${params.page}`)}`
								: `${router.asPath}${router.asPath.includes('?') ? '&' : '?'}page=${params.page}`
						}>
						<PaginationItem
							{...params}
							onClick={() => {
								window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
							}}>
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
		<Box
			display='flex'
			flexWrap={{ xs: 'wrap', md: 'nowrap' }}
			padding={{ xs: 0, md: '0.5em 0 0.5em 0.5em' }}
			gap={{ xs: '0.5em', md: 0 }}
			marginBottom='1em'
			alignItems={{ xs: 'initial', md: 'center' }}
			bgcolor={{ xs: 'initial', md: '#fff' }}>
			<Box display='flex' sx={{ order: { xs: 3, md: 0 }, width: { xs: '100%', md: 'auto' } }}>
				<Button
					variant='contained'
					onClick={handleClickChangeView('grid', position)}
					sx={{
						bgcolor: activeView === 'grid' ? 'primary.main' : '#000',
						display: { xs: position === 'bottom' ? 'none' : 'flex', md: 'flex' }
					}}
					className={classNames(styles['btn-view'])}>
					<GridViewIcon fontSize='small' sx={{ color: '#fff' }}></GridViewIcon>
				</Button>
				<Button
					variant='contained'
					sx={{
						bgcolor: activeView === 'list' ? 'primary.main' : '#000',
						display: { xs: position === 'bottom' ? 'none' : 'flex', md: 'flex' }
					}}
					onClick={handleClickChangeView('list', position)}
					className={classNames(styles['btn-view'])}>
					<MenuIcon fontSize='small' sx={{ color: '#fff' }}></MenuIcon>
				</Button>
			</Box>
			{position === 'top' && (
				<Button
					sx={{ display: { xs: 'flex', md: 'none' } }}
					variant='contained'
					onClick={handleClickOpenFilters}
					startIcon={<TuneIcon></TuneIcon>}>
					Параметры
				</Button>
			)}
			<Modal open={isOpenFilters} onClose={handleCloseFilters}>
				<Box padding='1em' bgcolor='#f1f2f6'>
					<Filters
						ref={filtersRef}
						total={total}
						config={filtersConfig}
						onClickFind={handleClickFind}></Filters>
				</Box>
			</Modal>
			<Input
				className={styles['search']}
				sx={{
					bgcolor: '#fff',
					maxWidth: 200,
					minWidth: 100,
					marginRight: { xs: 0, md: '1em' },
					paddingLeft: '0.5em',
					display: { xs: position === 'bottom' ? 'none' : 'initial', md: 'initial' },
					order: { xs: 2, md: 'initial' }
				}}
				onChange={handleChangeSearch}
				onKeyDown={handleKeyDown(position)}
				value={searchValue}
				placeholder={searchPlaceholder}></Input>
			<Select
				variant='standard'
				MenuProps={{ disableScrollLock: true }}
				value={sort as any}
				sx={{
					maxWidth: 150,
					display: { xs: position === 'bottom' ? 'none' : 'initial', md: 'initial' },
					order: { xs: 1, md: 'initial' }
				}}
				className={styles['sort-select']}
				onChange={handleChangeSort}>
				{selectSortItems.map((item) => (
					<MenuItem key={item.name} value={item.value}>
						{item.name}
					</MenuItem>
				))}
			</Select>
			{renderPagination(position)}
		</Box>
	);

	return (
		<>
			<Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'initial' } }}>
				<Box
					marginTop='3.7em'
					display={{ xs: 'none', md: 'block' }}
					marginRight='1em'
					component='aside'
					sx={{ width: { xs: '100%', md: '250px' } }}>
					<Filters
						ref={filtersRef}
						total={total}
						config={filtersConfig}
						onClickFind={handleClickFind}></Filters>
				</Box>
				<Box sx={{ width: { md: 'calc(100% - 250px - 2em)' } }}>
					<Box
						marginBottom='0.5em'
						marginTop='0'
						textTransform='uppercase'
						component='h1'
						typography={{ xs: 'h5', md: 'h4' }}>
						{seo?.h1}
					</Box>
					{renderBar('top')}
					<Box
						display='flex'
						flexWrap='wrap'
						gap={{ xs: '1em', md: 0 }}
						justifyContent={{ xs: 'center', md: 'space-between' }}
						className={classNames(
							styles.items,
							isLoading && styles['loading'],
							!data.length && styles['content-items_no-data']
						)}>
						{data.length ? (
							data.map((item) => (
								<ProductItem
									width={activeView === 'grid' ? 280 : '100%'}
									minHeight={activeView === 'grid' ? 390 : 150}
									dataFieldsToShow={dataFieldsToShow || []}
									activeView={activeView}
									key={item.id}
									data={item}></ProductItem>
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
					sx={{ paddingX: '1em' }}
					data={newProducts}
					title={
						<Typography withSeparator fontWeight='bold' marginBottom='1em' marginTop='1em' variant='h5'>
							ВАМ СТОИТ ОБРАТИТЬ ВНИМАНИЕ
						</Typography>
					}></CarouselProducts>
			)}
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
				{((brand && kindSparePart) || (brand && model)) && (
					<Typography>
						Если вы не смогли найти {catalogType === 'spare-parts' ? 'нужную' : 'нужный'} вам{' '}
						{anchorText[catalogType as keyof typeof anchorText]}, просто позвоните нам и мы попробуем
						подобрать нужную именно вам деталь от{' '}
						<NextLink href={getCatalogAnchor(router.pathname, brand, model, kindSparePart)}>
							<Link component='span' textTransform='capitalize' onClick={handleClickAnchor}>
								{getCatalogAnchorText(brand, model, kindSparePart)}
							</Link>
						</NextLink>
					</Typography>
				)}
			</Box>
		</>
	);
};

export default Catalog;
