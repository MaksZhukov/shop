import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, CircularProgress, Link, Modal, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { Brand } from 'api/brands/types';
import { fetchCabins } from 'api/cabins/cabins';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { fetchPage } from 'api/pages';
import { PageMain } from 'api/pages/types';
import { fetchProducts } from 'api/products/products';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import { TireBrand } from 'api/tireBrands/types';
import { fetchTireDiameters } from 'api/tireDiameters/tireDiameters';
import { TireDiameter } from 'api/tireDiameters/types';
import { fetchTireHeights } from 'api/tireHeights/tireHeights';
import { TireHeight } from 'api/tireHeights/types';
import { fetchTireWidths } from 'api/tireWidths/tireWidths';
import { TireWidth } from 'api/tireWidths/types';
import { fetchTires } from 'api/tires/tires';
import { ApiResponse, Product, ProductType } from 'api/types';
import { WheelDiameterCenterHole } from 'api/wheelDiameterCenterHoles/types';
import { fetchWheelDiameterCenterHoles } from 'api/wheelDiameterCenterHoles/wheelDiameterCenterHoles';
import { WheelDiameter } from 'api/wheelDiameters/types';
import { fetchWheelDiameters } from 'api/wheelDiameters/wheelDiameters';
import { WheelNumberHole } from 'api/wheelNumberHoles/types';
import { fetchWheelNumberHoles } from 'api/wheelNumberHoles/wheelNumberHoles';
import { WheelWidth } from 'api/wheelWidths/types';
import { fetchWheelWidths } from 'api/wheelWidths/wheelWidths';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import Autocomplete from 'components/Autocomplete';
import Image from 'components/Image';
import LinkWithImage from 'components/LinkWithImage';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import {
	BODY_STYLES_SLUGIFY,
	KIND_WHEELS_SLUGIFY,
	SEASONS_SLUGIFY,
	SLUGIFY_BODY_STYLES,
	SLUGIFY_FUELS,
	SLUGIFY_KIND_WHEELS,
	SLUGIFY_SEASONS,
	SLUGIFY_TRANSMISSIONS,
	TRANSMISSIONS_SLUGIFY
} from 'config';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import qs from 'qs';
import { Dispatch, ReactNode, SetStateAction, UIEventHandler, useRef, useState } from 'react';
import Slider from 'react-slick';
import { useDebounce, useThrottle } from 'rooks';
import { getPageProps } from 'services/PagePropsService';
import { getParamByRelation } from 'services/ParamsService';
import { BODY_STYLES, KIND_WHEELS, OFFSET_SCROLL_LOAD_MORE, SEASONS, TRANSMISSIONS } from '../constants';
import styles from './index.module.scss';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
const BrandsCarousel = dynamic(() => import('components/BrandsCarousel'));
const CarouselReviews = dynamic(() => import('components/CarouselReviews'));

const CATEGORIES = [
	{ name: 'Диски', href: '/wheels' },
	{ name: 'Салоны', href: '/cabins ' },
	{ name: 'Запчасти', href: '/spare-parts' },
	{ name: 'Колеса', href: '/tires' }
];

const nameByProductType = {
	sparePart: 'Запчасти',
	cabin: 'Салоны',
	wheel: 'Диски',
	tire: 'Шины'
};

const productTypeToSlug = {
	sparePart: 'spare-parts',
	wheel: 'wheels',
	cabin: 'cabins',
	tire: 'tires'
};

const fetchByType = {
	tire: fetchTires,
	wheel: fetchWheels,
	cabin: fetchCabins,
	sparePart: fetchSpareParts
};

const productTypeOptions = [
	{ label: 'Запчасти', value: 'sparePart' },
	{ label: 'Салоны', value: 'cabin' },
	{ label: 'Шины', value: 'tire' },
	{ label: 'Диски', value: 'wheel' }
] as { label: string; value: ProductType }[];

interface Props {
	page: PageMain;
	reviews: Review[];
	articles: Article[];
	brands: Brand[];
}

const Home: NextPage<Props> = ({ page, brands = [], reviews, articles }) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	const isLaptop = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
	const [wheelWidths, setWheelWidths] = useState<WheelWidth[]>([]);
	const [numberHoles, setNumberHoles] = useState<WheelNumberHole[]>([]);
	const [diameterCenterHoles, setDiameterCenterHoles] = useState<WheelDiameterCenterHole[]>([]);
	const [wheelDiameters, setWheelDiameters] = useState<WheelDiameter[]>([]);

	const [tireBrands, setTireBrands] = useState<TireBrand[]>([]);
	const [tireWidths, setTireWidths] = useState<TireWidth[]>([]);
	const [heights, setHeights] = useState<TireHeight[]>([]);
	const [tireDiameters, setTireDiameters] = useState<TireDiameter[]>([]);

	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
	const [values, setValues] = useState<{ [key: string]: string | null }>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const [selectedProduct, setSelectedProduct] = useState<{ label: string; value: string } | null>(null);
	const [productType, setProductType] = useState<ProductType | null>(null);
	const [isOpenedModal, setIsOpenModal] = useState<boolean>(false);

	const [products, setProducts] = useState<Product[]>([]);

	const router = useRouter();

	const loadKindSpareParts = async () => {
		const { data } = await fetchKindSpareParts({
			filters: { type: productType === 'cabin' ? 'cabin' : 'regular' },
			pagination: { start: kindSpareParts.data.length }
		});
		setKindSpareParts({ data: [...kindSpareParts.data, ...data.data], meta: data.meta });
	};

	const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
		setIsLoadingMore(true);
		await loadKindSpareParts();
		setIsLoadingMore(false);
	});

	const { enqueueSnackbar } = useSnackbar();

	const filtersCabinsAndSpareParts = {
		sold: false,
		brand: getParamByRelation(values.brand, 'slug'),
		model: getParamByRelation(values.model, 'slug'),
		generation: getParamByRelation(values.generation, 'slug'),
		kindSparePart: getParamByRelation(values.kindSparePart, 'slug'),
		fuel: values.fuel ? SLUGIFY_FUELS[values.fuel] : undefined,
		bodyStyle: values.bodyStyle ? SLUGIFY_BODY_STYLES[values.bodyStyle] : undefined,
		transmission: values.transmission ? SLUGIFY_TRANSMISSIONS[values.transmission] : undefined
	};

	const filters = {
		tire: {
			sold: false,
			brand: getParamByRelation(values.brand, 'slug'),
			width: getParamByRelation(values.width),
			height: getParamByRelation(values.height),
			diameter: getParamByRelation(values.diameter),
			season: values.season ? SLUGIFY_SEASONS[values.season] : undefined
		},
		wheel: {
			sold: false,
			brand: getParamByRelation(values.brand, 'slug'),
			diameterCenterHole: getParamByRelation(values.diameterCenterHole),
			numberHoles: getParamByRelation(values.numberHoles),
			diameter: getParamByRelation(values.diameter),
			width: getParamByRelation(values.width),
			kind: values.kind ? SLUGIFY_KIND_WHEELS[values.kind] : undefined
		},
		sparePart: filtersCabinsAndSpareParts,
		cabin: filtersCabinsAndSpareParts
	};

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		setIsLoading(true);
		const { data } = await fetchKindSpareParts({ filters: { name: { $contains: value } } });
		setKindSpareParts(data);
		setIsLoading(false);
	});
	const fetchProductsRef = useRef(async (value: string, filters: any, productType: ProductType) => {
		setIsLoading(true);
		let fetchFunc = fetchProducts;
		let apiFilters = {
			sold: false,
			$and: [...value.split(' ').map((word) => ({ h1: { $contains: word } }))]
		};
		if (productType && !isMobile) {
			fetchFunc = fetchByType[productType];
			apiFilters = { ...apiFilters, ...filters[productType] };
		}
		const {
			data: { data }
		} = await fetchFunc({
			filters: apiFilters
		});
		setProducts(data);
		setIsLoading(false);
	});
	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);
	const debouncedFetchProductsRef = useDebounce(fetchProductsRef.current, 300);

	const updateValue = (id: string, selected: { value: string } | string | null) => {
		let value = typeof selected === 'string' ? selected : selected?.value || null;
		setValues((prevValues) => ({ ...prevValues, [id]: value }));
	};

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
						data: { data }
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

	const handleChangeBrandAutocomplete = (_: any, selected: { value: string; label: string } | null) => {
		updateValue('brand', selected);
		updateValue('model', null);
		updateValue('generation', null);
		setModels([]);
		setProducts([]);
		setGenerations([]);
	};

	const handleChangeModelAutocomplete = (_: any, selected: { value: string; label: string } | null) => {
		updateValue('model', selected);
		updateValue('generation', null);
		setProducts([]);
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;
	const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
		fetchModels({
			filters: { brand: { slug: values.brand } },
			pagination: { limit: API_MAX_LIMIT }
		})
	);

	const handleOpenAutocompleteGeneration = handleOpenAutocomplete<Generation>(
		!!generations.length,
		setGenerations,
		() =>
			fetchGenerations({
				filters: { brand: { slug: values.brand }, model: { slug: values.model } },
				pagination: { limit: API_MAX_LIMIT }
			})
	);

	const handleOpenAutocompleteKindSparePart = async () => {
		if (!kindSpareParts.data.length) {
			setIsLoading(true);
			await loadKindSpareParts();
			setIsLoading(false);
		}
	};

	const handleInputChangeKindSparePart = (_: any, value: string) => {
		debouncedFetchKindSparePartsRef(value);
	};

	const handleInputChangeProducts = (_: any, value: string) => {
		debouncedFetchProductsRef(value, filters, productType);
	};

	const handleScrollKindSparePartAutocomplete: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement> = (
		event
	) => {
		if (
			event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
			event.currentTarget.scrollHeight
		) {
			throttledLoadMoreKindSpareParts();
		}
	};

	const handleChangeAutocomplete =
		(id: string) => (_: any, selected: { value: string; label: string } | string | null) => {
			updateValue(id, selected);
			setProducts([]);
		};

	const handleClickFind = () => {
		let url = '/';
		if (selectedProduct && !Object.keys(values).length) {
			const [, productType] = selectedProduct.value.split('-') as [string, ProductType];
			url = `/${productTypeToSlug[productType]}?searchValue=${selectedProduct.label}`;
		} else {
			let { brand, model, ...restValues } = values;
			let sanitazedValues = Object.keys(restValues).reduce(
				(prev, curr) => (restValues[curr] ? { ...prev, [curr]: restValues[curr] } : prev),
				selectedProduct ? { searchValue: selectedProduct.label } : {}
			);

			const query = qs.stringify(sanitazedValues, { encode: false });
			const formattedQuery = `${query ? `?${query}` : ''}`;
			if (productType === 'sparePart' || productType === 'cabin') {
				url = `/${productType === 'sparePart' ? 'spare-parts' : 'cabins'}/${
					model ? `${brand}/model-${model}` : brand ? `${brand}` : ''
				}${formattedQuery}`;
			} else if (productType === 'wheel') {
				url = `/wheels/${brand ? `${brand}` : ''}${formattedQuery}`;
			} else if (productType === 'tire') {
				url = `/tires/${brand ? `${brand}` : ''}${formattedQuery}`;
			}
		}

		router.push(url);
	};

	const handleClickOpenFilters = () => {
		setIsOpenModal(true);
	};

	const handleCloseModal = () => {
		setIsOpenModal(false);
	};

	const handleChangeProductType = (_: any, selected: { label: string; value: ProductType } | null) => {
		setProductType(selected?.value || null);
		setValues({});
		setProducts([]);
		setSelectedProduct(null);
		setKindSpareParts({ data: [], meta: {} });
	};

	const brandAutocompleteConfig = {
		id: 'brand',
		placeholder: 'Марка',
		options: brands.map((item) => ({ label: item.name, value: item.slug })),
		onChange: handleChangeBrandAutocomplete,
		noOptionsText: noOptionsText
	};

	const modelAutocompleteConfig = {
		id: 'model',
		placeholder: 'Модель',
		disabled: !values.brand,
		options: models.map((item) => ({ label: item.name, value: item.slug })),
		onChange: handleChangeModelAutocomplete,
		onOpen: handleOpenAutocompleteModel,
		noOptionsText: noOptionsText
	};

	const generationAutocompleteConfig = {
		id: 'generation',
		disabled: !values.model,
		placeholder: 'Поколение',
		options: generations.map((item) => ({ label: item.name, value: item.slug })),
		onOpen: handleOpenAutocompleteGeneration,
		noOptionsText: noOptionsText
	};

	const kindSparePartAutocompleteConfig = {
		id: 'kindSparePart',
		placeholder: 'Вид запчасти',
		options: kindSpareParts.data.map((item) => ({ label: item.name, value: item.slug })),
		loadingMore: isLoadingMore,
		onScroll: handleScrollKindSparePartAutocomplete,
		onOpen: handleOpenAutocompleteKindSparePart,
		onInputChange: handleInputChangeKindSparePart,
		noOptionsText: noOptionsText
	};

	const cabinsFiltersConfig = [
		brandAutocompleteConfig,
		modelAutocompleteConfig,
		generationAutocompleteConfig,
		kindSparePartAutocompleteConfig
	];

	const sparePartsFiltersConfig = [
		...cabinsFiltersConfig,
		{
			id: 'bodyStyle',
			placeholder: 'Кузов',
			options: BODY_STYLES.map((item) => ({ label: item, value: BODY_STYLES_SLUGIFY[item] }))
		},

		{
			id: 'transmission',
			placeholder: 'Коробка',
			options: TRANSMISSIONS.map((item) => ({ label: item, value: TRANSMISSIONS_SLUGIFY[item] }))
		}
	];

	const filtersConfig: {
		[key: string]: {
			id: string;
			placeholder: string;
			disabled?: boolean;
			options: readonly (string | { label: string; value: string })[];
			onOpen?: () => void;
			onChange?: (
				_: any,
				selected: {
					value: string;
					label: string;
				} | null
			) => void;
			onScroll?: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement>;
			loadingMore?: boolean;
			onInputChange?: (_: any, value: string) => void;
			noOptionsText?: ReactNode;
		}[];
	} = {
		sparePart: sparePartsFiltersConfig,
		cabin: cabinsFiltersConfig,
		wheel: [
			{
				id: 'kind',
				placeholder: 'Тип диска',
				options: KIND_WHEELS.map((item) => ({ label: item, value: KIND_WHEELS_SLUGIFY[item] }))
			},
			brandAutocompleteConfig,
			{
				id: 'width',
				placeholder: 'J ширина, мм',
				options: wheelWidths.map((item) => item.name.toString()),
				onOpen: handleOpenAutocomplete<WheelWidth>(!!wheelWidths.length, setWheelWidths, () =>
					fetchWheelWidths({
						pagination: { limit: API_MAX_LIMIT }
					})
				),
				noOptionsText: noOptionsText
			},
			{
				id: 'diameter',
				placeholder: 'R диаметр, дюйм',
				options: wheelDiameters.map((item) => item.name),
				onOpen: handleOpenAutocomplete<WheelDiameter>(!!wheelDiameters.length, setWheelDiameters, () =>
					fetchWheelDiameters({
						pagination: { limit: API_MAX_LIMIT }
					})
				),
				noOptionsText: noOptionsText
			},
			{
				id: 'numberHoles',
				placeholder: 'Количество отверстий',
				options: numberHoles.map((item) => item.name.toString()),
				onOpen: handleOpenAutocomplete<WheelNumberHole>(!!numberHoles.length, setNumberHoles, () =>
					fetchWheelNumberHoles({
						pagination: { limit: API_MAX_LIMIT }
					})
				),
				noOptionsText: noOptionsText
			},
			{
				id: 'diameterCenterHole',
				placeholder: 'DIA диаметр центрального отверстия, мм',
				options: diameterCenterHoles.map((item) => item.name.toString()),
				onOpen: handleOpenAutocomplete<WheelDiameterCenterHole>(
					!!diameterCenterHoles.length,
					setDiameterCenterHoles,
					() =>
						fetchWheelDiameterCenterHoles({
							pagination: { limit: API_MAX_LIMIT }
						})
				),
				noOptionsText: noOptionsText
			}
		],
		tire: [
			{
				id: 'brand',
				placeholder: 'Марка',
				options: tireBrands.map((item) => ({ label: item.name, value: item.slug })),
				onOpen: handleOpenAutocomplete<TireBrand>(!!tireBrands.length, setTireBrands, () =>
					fetchTireBrands({
						pagination: { limit: API_MAX_LIMIT }
					})
				),
				noOptionsText: noOptionsText
			},

			{
				id: 'width',
				placeholder: 'Ширина',
				options: tireWidths.map((item) => item.name.toString()),
				onOpen: handleOpenAutocomplete<TireWidth>(!!tireWidths.length, setTireWidths, () =>
					fetchTireWidths({
						pagination: { limit: API_MAX_LIMIT }
					})
				),
				noOptionsText: noOptionsText
			},

			{
				id: 'height',
				placeholder: 'Высота',
				options: heights.map((item) => item.name.toString()),
				onOpen: handleOpenAutocomplete<TireHeight>(!!heights.length, setHeights, () =>
					fetchTireHeights({
						pagination: { limit: API_MAX_LIMIT }
					})
				),
				noOptionsText: noOptionsText
			},

			{
				id: 'diameter',
				placeholder: 'Диаметр',
				options: tireDiameters.map((item) => item.name),
				onOpen: handleOpenAutocomplete<TireDiameter>(!!tireDiameters.length, setTireDiameters, () =>
					fetchTireDiameters({
						pagination: { limit: API_MAX_LIMIT }
					})
				),
				noOptionsText: noOptionsText
			},
			{
				id: 'season',
				placeholder: 'Сезон',
				options: SEASONS.map((item) => ({ label: item, value: SEASONS_SLUGIFY[item] }))
			}
		]
	};

	const handleChangeAutocompleteProduct = (_: any, selected: { value: string; label: string } | null) => {
		setSelectedProduct(selected);
	};

	const renderProductTypeAutocomplete = (
		<Autocomplete
			onChange={handleChangeProductType}
			value={productTypeOptions.find((item) => item.value === productType)}
			placeholder='Категория товара'
			options={productTypeOptions}
		></Autocomplete>
	);

	const handleOpenProductAutocomplete = {
		tire: handleOpenAutocomplete<Product>(!!products.length, setProducts, () =>
			fetchTires({ filters: filters.tire })
		),
		wheel: handleOpenAutocomplete<Product>(!!products.length, setProducts, () =>
			fetchWheels({ filters: filters.wheel })
		),
		cabin: handleOpenAutocomplete<Product>(!!products.length, setProducts, () =>
			fetchCabins({ filters: filtersCabinsAndSpareParts })
		),
		sparePart: handleOpenAutocomplete<Product>(!!products.length, setProducts, () =>
			fetchSpareParts({ filters: filtersCabinsAndSpareParts })
		)
	};

	const renderMobileFilters = (
		<Box marginTop='1em'>
			<Box display='flex' gap={'0.5em'} alignItems='center'>
				<Autocomplete
					noOptionsText={noOptionsText}
					onOpen={
						productType
							? handleOpenProductAutocomplete[productType]
							: handleOpenAutocomplete<Product>(!!products.length, setProducts, () =>
									fetchProducts({ filters: { sold: false } })
							  )
					}
					filterOptions={(options) => options}
					value={selectedProduct}
					onInputChange={handleInputChangeProducts}
					onChange={handleChangeAutocompleteProduct}
					placeholder='Поиск товара'
					renderOption={(props, option) => (
						<li {...props} key={option.value}>
							{option.label}
						</li>
					)}
					options={products.map((item) => ({
						label: item.h1,
						value: item.id + '-' + item.type
					}))}
				></Autocomplete>
				<Button onClick={handleClickFind} variant='contained' className={styles['btn-search']}>
					Найти
				</Button>
			</Box>
			<Box marginTop='0.5em'>
				<Button variant='contained' onClick={handleClickOpenFilters} startIcon={<TuneIcon></TuneIcon>}>
					Фильтры
				</Button>
			</Box>
			<Modal open={isOpenedModal} onClose={handleCloseModal}>
				<Container>
					<Box marginY='2em' bgcolor='#fff'>
						<Box>{renderProductTypeAutocomplete}</Box>
						{productType &&
							filtersConfig[productType].map((item) => {
								let value = (item.options as any[]).every((option: any) => typeof option === 'string')
									? values[item.id]
									: (item.options as any[]).find((option) => option.value === values[item.id]);
								return (
									<Box key={item.id}>
										<Autocomplete
											sx={{ paddingY: '2em' }}
											options={item.options}
											noOptionsText={item.noOptionsText}
											onOpen={item.onOpen}
											placeholder={item.placeholder}
											onScroll={item.onScroll}
											onChange={item.onChange || handleChangeAutocomplete(item.id)}
											fullWidth
											onInputChange={item.onInputChange}
											disabled={item.disabled}
											value={value || null}
										></Autocomplete>
									</Box>
								);
							})}
						<Button onClick={handleClickFind} variant='contained' fullWidth>
							Найти
						</Button>
					</Box>
				</Container>
			</Modal>
		</Box>
	);

	const renderDesktopFilters = (
		<Box
			display='flex'
			width='calc(100% - 48px)'
			position='absolute'
			bottom='2em'
			className={styles['head-search']}
		>
			<Box display='flex' gap='0.5em' flex='1' flexWrap='wrap' className={styles.filters}>
				<Box width={productType ? 'calc(25% - 0.5em)' : 'calc(50% - 0.5em)'}>
					<Autocomplete
						noOptionsText={noOptionsText}
						onOpen={
							productType
								? handleOpenProductAutocomplete[productType]
								: handleOpenAutocomplete<Product>(!!products.length, setProducts, () =>
										fetchProducts({ filters: { sold: false } })
								  )
						}
						filterOptions={(options) => options}
						value={selectedProduct}
						onInputChange={handleInputChangeProducts}
						onChange={handleChangeAutocompleteProduct}
						placeholder='Поиск товара'
						renderOption={(props, option) => (
							<li {...props} key={option.value}>
								{option.label}
							</li>
						)}
						options={products.map((item) => ({
							label: item.h1,
							value: item.id + '-' + item.type
						}))}
					></Autocomplete>
				</Box>
				<Box width={productType ? 'calc(25% - 0.5em)' : 'calc(50% - 0.5em)'}>
					{renderProductTypeAutocomplete}
				</Box>
				{productType &&
					filtersConfig[productType].map((item) => {
						let value = (item.options as any[]).every((option: any) => typeof option === 'string')
							? values[item.id]
							: (item.options as any[]).find((option) => option.value === values[item.id]);
						return (
							<Box width={'calc(25% - 0.5em)'} key={item.id}>
								<Autocomplete
									options={item.options}
									noOptionsText={item.noOptionsText}
									onOpen={item.onOpen}
									placeholder={item.placeholder}
									onScroll={item.onScroll}
									onChange={item.onChange || handleChangeAutocomplete(item.id)}
									fullWidth
									onInputChange={item.onInputChange}
									disabled={item.disabled}
									value={value || null}
								></Autocomplete>
							</Box>
						);
					})}
			</Box>
			<Button onClick={handleClickFind} variant='contained' className={styles['btn-search']}>
				Найти
			</Button>
		</Box>
	);

	return (
		<>
			<Box
				sx={{ height: { xs: 'calc(100vh - 56px - 60px)', sm: 'calc(100vh - 64px)' } }}
				className={styles['head-section']}
			>
				<Image
					loading='eager'
					title={isMobile ? page.bannerMobile?.caption : page.banner?.caption}
					width={isMobile ? page.bannerMobile?.width : page.banner?.width}
					height={isMobile ? page.bannerMobile?.height : page.banner?.height}
					style={{
						position: 'absolute',
						top: 0,
						objectFit: isMobile
							? 'fill'
							: isLaptop &&
							  typeof window !== 'undefined' &&
							  ((window.innerHeight - 64) / (page.banner?.height || 1)) * (page.banner?.width || 1) <
									window.innerWidth
							? 'cover'
							: 'fill',
						width: '100vw',
						height: '100%',
						...(isMobile ? { objectPosition: '70%' } : {})
					}}
					src={isMobile ? page.bannerMobile?.url : page.banner?.url || ''}
					alt={isMobile ? page.bannerMobile?.alternativeText : page.banner?.alternativeText || ''}
				></Image>
				<Container sx={{ height: '100%', position: 'relative' }}>
					<Box maxWidth='650px' paddingTop={{ xs: '1em', sm: '3em' }}>
						<Typography fontWeight='bold' component='h1' variant={isMobile ? 'h4' : 'h3'}>
							{page.h1}
						</Typography>
						<Typography component='h2' variant={isMobile ? 'h5' : 'h4'}>
							{page.subH1}
						</Typography>
					</Box>
					{isMobile ? renderMobileFilters : renderDesktopFilters}
				</Container>
			</Box>
			<Container>
				<Typography
					withSeparator
					component='h2'
					variant={isMobile ? 'h5' : 'h4'}
					sx={{ marginBottom: { xs: '0.5em', md: '1.5em' } }}
					fontWeight='bold'
					textTransform='uppercase'
				>
					{page.titleCategories}
				</Typography>
				<Box
					className={styles.categories}
					display='flex'
					sx={{
						flexWrap: { xs: 'wrap', md: 'initial' },
						gap: { xs: '5%', md: 'initial' },
						marginBottom: { xs: '2em', md: '4em' }
					}}
				>
					{page.categoryImages?.map((item, i) => (
						<Box
							key={item.id}
							className={classNames(styles.categories__item, isMobile && styles.categories__item_mobile)}
						>
							<NextLink href={CATEGORIES[i].href}>
								<Box
									position='relative'
									zIndex={1}
									display='flex'
									alignItems='center'
									justifyContent='center'
									minHeight='250px'
								>
									<Image
										title={item.caption}
										src={item.url}
										width={item.width}
										height={item.height}
										alt={item.alternativeText}
									></Image>
								</Box>
								<Typography
									className={styles['categories__item-name']}
									marginBottom='0.25em'
									textAlign='center'
									component='h3'
									variant='h4'
								>
									<Link component='span' underline='hover' color='inherit'>
										{CATEGORIES[i].name}
									</Link>
								</Typography>
							</NextLink>
						</Box>
					))}
					<Box
						position='relative'
						className={classNames(styles.categories__item, isMobile && styles.categories__item_mobile)}
					>
						<Image
							width={260}
							height={300}
							alt='Выкуп авто на з/ч'
							isOnSSR={false}
							style={isMobile ? { objectFit: 'cover' } : {}}
							src='/main_buyback.png'
						></Image>
						<NextLink href={'/buyback-cars'}>
							<Link
								position='absolute'
								top={'5px'}
								variant={isMobile ? 'h5' : 'h4'}
								textTransform='uppercase'
								fontWeight='bold'
								component='span'
								display='block'
								underline='hover'
								margin='0.25em 0.125em'
								color='inherit'
							>
								Выкуп <br /> авто на з/ч
							</Link>
						</NextLink>
					</Box>
				</Box>
				{isMobile ? (
					<Box paddingX='1em'>
						<Slider slidesToShow={2}>
							{page.benefits?.map((item) => (
								<Box paddingX='0.5em' key={item.id}>
									<LinkWithImage
										withoutTitle
										link={item.link}
										image={item.image}
										width={200}
										height={140}
									></LinkWithImage>
								</Box>
							))}
						</Slider>
					</Box>
				) : (
					<Box flexWrap='wrap' marginBottom='4em' justifyContent='space-between' display='flex'>
						{page.benefits?.map((item) => (
							<LinkWithImage
								key={item.id}
								withoutTitle
								link={item.link}
								image={item.image}
								width={200}
								height={140}
							></LinkWithImage>
						))}
					</Box>
				)}
				<Box marginBottom='4em'>
					<Typography
						withSeparator
						component='h2'
						variant={isMobile ? 'h5' : 'h4'}
						sx={{ marginBottom: { xs: '0.5em', md: '1.5em' } }}
						fontWeight='bold'
						maxWidth='700px'
						textTransform='uppercase'
					>
						{page.popularBrandsTitle}
					</Typography>
				</Box>
				<Box paddingX='1em' marginBottom='2em'>
					<BrandsCarousel brands={brands}></BrandsCarousel>
				</Box>
				<Box
					display='flex'
					gap='3em'
					sx={{ marginBottom: { xs: '2em', md: '5em' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}
				>
					<Box display='flex' alignItems='center'>
						<Typography color='text.secondary' variant='body1'>
							<ReactMarkdown content={page.leftSideText}></ReactMarkdown>
						</Typography>
					</Box>
					<Box width={'100%'}>
						<ReactPlayer width={isMobile ? '100%' : 600} height={300} url={page.videoUrl}></ReactPlayer>
					</Box>
				</Box>
				<Typography withSeparator component='h2' variant={isMobile ? 'h5' : 'h4'} fontWeight='bold'>
					{page.reviewsTitle}
				</Typography>
				<Box marginBottom={isMobile ? '3em' : '5em'}>
					<CarouselReviews
						marginBottom='1em'
						data={reviews}
						slidesToShow={isMobile ? 1 : isTablet ? 2 : 4}
					></CarouselReviews>
				</Box>
				<Box marginBottom='1em'>
					<Typography
						fontWeight='bold'
						maxWidth='500px'
						withSeparator
						component='h2'
						variant={isMobile ? 'h5' : 'h4'}
						marginBottom='1em'
					>
						{page.benefitsTitle}
					</Typography>
					<Box display='flex' flexDirection={isMobile ? 'column-reverse' : 'initial'}>
						<Typography flex='1' color='text.secondary' variant='body1'>
							<ReactMarkdown content={page.benefitsLeftText}></ReactMarkdown>
						</Typography>
						<Box marginTop={isMobile ? '0' : '-2em'}>
							<Image
								title={page.benefitsRightImage?.caption}
								src={page.benefitsRightImage?.url}
								style={isMobile ? { maxWidth: '100%', objectFit: 'contain', height: 'auto' } : {}}
								width={617}
								height={347}
								alt={page.benefitsRightImage?.alternativeText}
							></Image>
						</Box>
					</Box>
				</Box>
				<Box>
					<Typography
						fontWeight='bold'
						withSeparator
						component='h2'
						variant={isMobile ? 'h5' : 'h4'}
						marginBottom='1em'
					>
						{page.blogTitle}
					</Typography>
					<Box
						padding='0 2.5em'
						display='flex'
						flexWrap='wrap'
						sx={{ flexDirection: { xs: 'column', md: 'initial' }, gap: { xs: '1em', md: '4em' } }}
					>
						<Typography
							sx={{ paddingBottom: { xs: '0.5em', md: '2em' } }}
							flex='1'
							color='text.secondary'
							variant='body1'
						>
							<ReactMarkdown content={page.blogLeftText}></ReactMarkdown>
						</Typography>
						<Box
							sx={{
								borderBottom: {
									xs: '1px solid rgba(0, 0, 0, 0.3)',
									md: 'none',
									borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.3)' }
								}
							}}
						></Box>
						<Typography
							sx={{ paddingBottom: { xs: '0', md: '2em' } }}
							flex='1'
							color='text.secondary'
							variant='body1'
						>
							<ReactMarkdown content={page.blogRightText}></ReactMarkdown>
						</Typography>
					</Box>
					{isTablet ? (
						<Box marginBottom='1em' paddingX='1em'>
							<Slider slidesToShow={1}>
								{articles.map((item) => (
									<Box paddingX='0.5em' key={item.id}>
										<LinkWithImage
											link={`/articles/${item.slug}`}
											height={290}
											imageStyle={{ objectFit: 'cover', width: '100%' }}
											key={item.id}
											width={390}
											typographyProps={{ width: '100%', variant: 'h6', marginTop: '1em' }}
											caption={item.name}
											image={item.mainImage}
										></LinkWithImage>
									</Box>
								))}
							</Slider>
						</Box>
					) : (
						<Box display='flex' gap={'1em'} marginBottom='3.5em'>
							{articles.map((item) => (
								<LinkWithImage
									link={`/articles/${item.slug}`}
									height={290}
									imageStyle={{ objectFit: 'cover', maxWidth: '100%' }}
									key={item.id}
									width={390}
									typographyProps={{ maxWidth: 390, variant: 'h6', marginTop: '1em' }}
									caption={item.name}
									image={item.mainImage}
								></LinkWithImage>
							))}
						</Box>
					)}
				</Box>
				<Box marginBottom='2em'>
					<Typography
						fontWeight='bold'
						withSeparator
						component='h2'
						variant={isMobile ? 'h5' : 'h4'}
						marginBottom='1em'
					>
						{page.deliveryTitle}
					</Typography>
					<Typography flex='1' color='text.secondary' variant='body1'>
						<ReactMarkdown content={page.deliveryText}></ReactMarkdown>
					</Typography>
				</Box>
				{isTablet ? (
					<Box paddingX='1em' marginBottom='2em'>
						<Slider slidesToShow={2}>
							{page.serviceStations?.map((item) => (
								<Box key={item.id} paddingX='0.5em'>
									<WhiteBox>
										<LinkWithImage
											height={100}
											width={isMobile ? 150 : 264}
											image={item.image}
											imageStyle={{ maxWidth: '100%', objectFit: 'contain', margin: 'auto' }}
											typographyProps={{ minHeight: '64px', variant: 'h6', marginTop: '1em' }}
											link={`/service-stations/${item.slug}`}
										></LinkWithImage>
									</WhiteBox>
								</Box>
							))}
							{page.autocomises?.map((item) => (
								<Box key={item.id} paddingX='0.5em'>
									<WhiteBox>
										<LinkWithImage
											imageStyle={{ maxWidth: '100%', objectFit: 'contain', margin: 'auto' }}
											height={100}
											width={isMobile ? 150 : 208}
											image={item.image}
											typographyProps={{ minHeight: '64px', variant: 'h6', marginTop: '1em' }}
											link={`/autocomises/${item.slug}`}
										></LinkWithImage>
									</WhiteBox>
								</Box>
							))}
						</Slider>
					</Box>
				) : (
					<Box display='flex' gap={'2em'} marginBottom='4em' justifyContent='space-between'>
						{page.serviceStations?.map((item) => (
							<Box bgcolor='#fff' padding='1em' sx={{ width: { xs: 'auto', md: '22.5%' } }} key={item.id}>
								<LinkWithImage
									// height={100}
									imageStyle={{ width: '100%', objectFit: 'contain' }}
									width={264}
									image={item.image}
									link={`/service-stations/${item.slug}`}
								></LinkWithImage>
							</Box>
						))}
						{page.autocomises?.map((item) => (
							<Box bgcolor='#fff' padding='1em' sx={{ width: { xs: 'auto', md: '22.5%' } }} key={item.id}>
								<LinkWithImage
									imageStyle={{ width: '100%', objectFit: 'contain' }}
									// height={100}
									width={264}
									image={item.image}
									link={`/autocomises/${item.slug}`}
								></LinkWithImage>
							</Box>
						))}
					</Box>
				)}
			</Container>
		</>
	);
};

export default Home;

export const getServerSideProps = getPageProps(
	fetchPage('main', {
		populate: [
			'seo',
			'benefits.image',
			'categoryImages',
			'banner',
			'bannerMobile',
			'benefitsRightImage',
			'autocomises.image',
			'serviceStations.image'
		]
	}),
	async () => ({
		articles: (await fetchArticles({ sort: 'createdAt:desc', populate: 'mainImage', pagination: { limit: 3 } }))
			.data.data
	}),
	async () => ({
		reviews: (await fetchReviews()).data.data
	}),
	() => ({ hasGlobalContainer: false, hideSEOBox: true })
);
