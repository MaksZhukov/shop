import { Button, CircularProgress, MenuItem, Menu, Pagination, PaginationItem, List, ListItem } from '@mui/material';
import { Box } from '@mui/material';
import { API_DEFAULT_LIMIT } from 'api/constants';
import { ModelSparePartsCountWithGenerationsSparePartsCount } from 'api/models/types';
import { ApiResponse, CollectionParams, Product, SEO } from 'api/types';
import { AxiosResponse } from 'axios';
import Filters from 'components/Filters';
import { AutocompleteType, NumberType } from 'components/Filters/types';
import ProductItem from 'components/ProductItem';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useThrottle } from 'rooks';

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

import { ChevronDownIcon } from 'components/Icons';
import { BrandWithSparePartsCount } from 'api/brands/types';
import { Link } from 'components/ui';

interface Props {
	seo: SEO | null;
	dataFieldsToShow?: { id: string; name: string }[];
	filtersConfig: (AutocompleteType | NumberType)[];
	generateFiltersByQuery?: (filter: { [key: string]: string }, fetchFunc: any) => any;
	fetchData?: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>;
	brands: BrandWithSparePartsCount[];
	models: ModelSparePartsCountWithGenerationsSparePartsCount[];
	filtersValues: { [key: string]: string | null };
	total: number | null;
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
	onChangeTotal: (total: number) => void;
}

const Catalog = ({
	fetchData,
	filtersConfig,
	generateFiltersByQuery,
	seo,
	brands,
	models,
	filtersValues,
	total,
	onChangeTotal,
	onChangeFilterValues
}: Props) => {
	const [data, setData] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [pageCount, setPageCount] = useState<number>(0);
	const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
	const filtersRef = useRef<any>(null);
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

	const fetchProducts = async ({ searchValue, ...values }: any, paramPage?: number) => {
		setIsLoading(true);
		if (fetchData) {
			try {
				const { data } = await fetchData({
					filters: {
						sold: false,
						...(searchValue
							? {
									$and: searchValue.split(' ').map((word: string) => ({ h1: { $contains: word } }))
							  }
							: {}),
						...(generateFiltersByQuery ? generateFiltersByQuery(values, fetchData) : {})
					},
					pagination: searchValue
						? {}
						: { start: (paramPage ? paramPage - 1 : +page - 1) * API_DEFAULT_LIMIT },
					populate: { images: true, volume: true, brand: true },
					sort
				});

				setData(data.data);

				if (data.meta.pagination) {
					setPageCount(Math.ceil(data.meta.pagination.total / API_DEFAULT_LIMIT));
					if (paramPage) {
						router.query.page = '1';
					} else if (router.query.page && Math.ceil(data.meta.pagination.total / API_DEFAULT_LIMIT) < +page) {
						router.query.page = (Math.ceil(data.meta.pagination.total / API_DEFAULT_LIMIT) || 1).toString();
					}
					onChangeTotal(data.meta.pagination.total);
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
		if (router.isReady) {
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
	}, [sort, page, brand, model, router.isReady, kindSparePart]);

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

	const handleClickFind = () => {
		const slug: string[] = [];
		const { brand: brandValue, model: modelValue, ...restFiltersValues } = filtersValues;
		if (brandValue) {
			slug.push(brandValue);
		}
		if (modelValue) {
			slug.push('model-' + modelValue);
		}
		Object.keys(restFiltersValues).forEach((key) => {
			if (restFiltersValues[key]) {
				router.query[key] = restFiltersValues[key];
			} else {
				delete router.query[key];
			}
		});
		router.query['slug'] = slug;
		fetchProducts(filtersValues, 1);

		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
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

			<Box display='flex' overflow='auto' gap={2}>
				<Box width={256} component='aside'>
					<Filters
						ref={filtersRef}
						total={total}
						config={filtersConfig}
						onClickFind={handleClickFind}
						values={filtersValues}
						onChangeFilterValues={onChangeFilterValues}
					></Filters>
				</Box>
				<Box flex={1}>
					{(!filtersValues.brand || !filtersValues.model) && (
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
							{!filtersValues.brand &&
								brands.map((brand) => (
									<Box py={1} display='flex' gap={0.5} key={brand.id}>
										<Link href={`/spare-parts/${brand.slug}`}>{brand.name}</Link>
										<Typography color='custom.text-muted'>{brand.spareParts?.count}</Typography>
									</Box>
								))}
							{filtersValues.brand &&
								!filtersValues.model &&
								models.map((model) => (
									<>
										{model.generations?.map((generation) => (
											<Box display='flex' gap={0.5} py={1} key={generation.id}>
												<Link
													href={`/spare-parts/${filtersValues.brand}/model-${model.slug}?generation=${generation.slug}`}
												>
													{model.name} {generation.name}
												</Link>
												<Typography color='custom.text-muted'>
													{generation.spareParts?.count}
												</Typography>
											</Box>
										))}
									</>
								))}
						</Box>
					)}
					<Box display='flex' flexWrap='wrap' gap={1} mb={2}>
						{data.length ? (
							data.map((item) => (
								<ProductItem
									sx={{ margin: 'initial' }}
									width={278}
									imageHeight={220}
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
					<Pagination
						sx={{
							display: 'flex',
							justifyContent: 'center'
						}}
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
											: `${router.asPath}${router.asPath.includes('?') ? '&' : '?'}page=${
													params.page
											  }`
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
				</Box>
			</Box>

			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Заказать Б/У запчасти в Гродно и Беларуси
			</Typography>
			<Typography variant='body1' mb={2} sx={{ lineHeight: 2.5 }}>
				Оригинальные Б/У автозапчасти BMW в Гродно и по всей Беларуси <br />
				Ищете качественные автозапчасти? У нас — большой выбор оригинальных Б/У запчастей с разборок Европы и
				США. <br />
				Мы предлагаем надежные и доступные комплектующие, которые помогут сэкономить без потери качества. Почему
				выбирают нас? <br />
				Специализация на Б/У запчастях BMW и других марок <br />
				Проверенные детали с европейских и американских разборок <br />
				Доставка по Гродно и всей Беларуси <br />
				Помощь в подборе, честные цены, гарантия <br />
				Обеспечьте свой автомобиль надежными и оригинальными деталями — без лишних затрат! <br />
				Б/У запчасти в отличном состоянии — это разумный выбор
			</Typography>
			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Покупка Б/У запчастей в Гродно и Беларуси по хорошим ценам
			</Typography>
			<List sx={{ listStyleType: 'disc', pl: 2, fontSize: 14, mb: 2 }}>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Экономия бюджета: Покупая Б/У автозапчасти, вы значительно сокращаете расходы. Стоимость
					оригинальных подержанных деталей существенно ниже новых, при этом вы получаете надежные и
					совместимые комплектующие — без переплат
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Оригинальные комплектующие: Мы поставляем Б/У запчасти с минимальным пробегом, снятые с автомобилей
					с разборок Европы и США. Это 100% оригинальные детали от производителя — полная совместимость и
					высокое качество гарантированы
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Быстрый ремонт — без ожидания: Не нужно ждать поставок неделями — у нас вы можете купить нужные Б/У
					автозапчасти в Гродно с доставкой по всей Беларуси. Быстрая обработка заказов и доставка позволяют
					вам приступить к ремонту сразу
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Широкий ассортимент запчастей: В наличии — большой выбор подержанных запчастей различных годов
					выпуска и модификаций. Вы легко подберёте нужную деталь под конкретную модель
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Уверенность и удобство: Мы предоставляем гарантийный срок на проверку определённых категорий
					запчастей (4 дней на КПП, редукторы, раздатки, форсунки и 30 дней на ДВС (в сборе и без навесного
					оборудования)
				</ListItem>
			</List>
			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Б/У запчасти в Гродно и Беларуси – продажа с гарантией качества и по выгодным ценам
			</Typography>
			<Typography mb={2}>
				Ищете надёжные Б/У запчасти в Гродно или других городах Беларуси? В интернет-магазине Авторазборка
				Полотково ООО "Дриблинг" вы найдёте широкий выбор оригинальных запасных частей с минимальным пробегом.
				Мы предлагаем высококачественные комплектующие по доступным ценам – как для популярных моделей, так и
				для редких комплектаций. <br />
			</Typography>
			<Typography variant='h6' fontWeight={700} fontSize={18}>
				Почему выбирают нас:
			</Typography>
			<List sx={{ listStyleType: 'disc', pl: 2, fontSize: 14 }}>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Все запчасти извлечены из автомобилей с низким пробегом и прошли проверку технического состояния.
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Подбор деталей по VIN-номеру, году выпуска и комплектации кузова – точно и быстро.
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Постоянное обновление ассортимента и возможность заранее узнать о наличии нужной позиции.
				</ListItem>
				<ListItem sx={{ display: 'list-item', p: 0 }}>
					Профессиональная консультация и поддержка на всех этапах покупки.
				</ListItem>
			</List>
			<Typography lineHeight={2.5}>
				Доставка по Гродно и всей Беларуси. <br />
				Наш магазин работает ежедневно: <br />
				Будние дни – с 10:00 до 18:00 <br />
				Выходные – с 10:00 до 14:00 <br />
				Связаться с нами можно через сайт, мессенджеры или социальные сети. <br />
				Авторазборка Полотково ООО "Дриблинг" – ваш проверенный поставщик оригинальных Б/У автозапчастей
			</Typography>
		</>
	);
};

export default Catalog;
