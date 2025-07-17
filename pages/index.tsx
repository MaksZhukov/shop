import TuneIcon from '@mui/icons-material/Tune';
import { Box, CircularProgress, Input, Link, Modal, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import { Container } from '@mui/material';
import { Brand } from 'api/brands/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { fetchPage } from 'api/pages';
import { PageMain } from 'api/pages/types';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import Carousel from 'react-multi-carousel';
import { TireBrand } from 'api/tireBrands/types';
import { fetchTireDiameters } from 'api/tireDiameters/tireDiameters';
import { TireDiameter } from 'api/tireDiameters/types';
import { fetchTireHeights } from 'api/tireHeights/tireHeights';
import { TireHeight } from 'api/tireHeights/types';
import { fetchTireWidths } from 'api/tireWidths/tireWidths';
import { TireWidth } from 'api/tireWidths/types';
import { ApiResponse, ProductType } from 'api/types';
import { WheelDiameterCenterHole } from 'api/wheelDiameterCenterHoles/types';
import { fetchWheelDiameterCenterHoles } from 'api/wheelDiameterCenterHoles/wheelDiameterCenterHoles';
import { WheelDiameter } from 'api/wheelDiameters/types';
import { fetchWheelDiameters } from 'api/wheelDiameters/wheelDiameters';
import { WheelNumberHole } from 'api/wheelNumberHoles/types';
import { fetchWheelNumberHoles } from 'api/wheelNumberHoles/wheelNumberHoles';
import { WheelWidth } from 'api/wheelWidths/types';
import { fetchWheelWidths } from 'api/wheelWidths/wheelWidths';
import axios, { AxiosResponse } from 'axios';
import classNames from 'classnames';
import Autocomplete from 'components/Autocomplete';
import Image from 'components/Image';
import LinkWithImage from 'components/LinkWithImage';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { BODY_STYLES_SLUGIFY, KIND_WHEELS_SLUGIFY, SEASONS_SLUGIFY, TRANSMISSIONS_SLUGIFY } from 'config';
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
import { BODY_STYLES, KIND_WHEELS, OFFSET_SCROLL_LOAD_MORE, SEASONS, TRANSMISSIONS } from '../constants';
import styles from './index.module.scss';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import { ChevronRightIcon } from 'components/Icons';
import { Button } from 'components/ui';
import ProductItem from 'components/ProductItem';
import { ShareButtons } from 'components/features/ShareButtons';
import { fetchCarOnParts, fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import CarItem from 'components/CarItem';

const BrandsCarousel = dynamic(() => import('components/BrandsCarousel'));
const CarouselReviews = dynamic(() => import('components/CarouselReviews'));

const CATEGORIES = [
	{ name: 'Диски', href: '/wheels' },
	{ name: 'Салоны', href: '/cabins ' },
	{ name: 'Запчасти', href: '/spare-parts' },
	{ name: 'Шины', href: '/tires' }
];

const productTypeOptions = [
	{ label: 'Запчасти', value: 'sparePart' },
	{ label: 'Салоны', value: 'cabin' },
	{ label: 'Шины', value: 'tire' },
	{ label: 'Диски', value: 'wheel' }
] as { label: string; value: ProductType }[];

interface Props {
	page: PageMain;
	reviews: Review[];
	brands: Brand[];
	newSpareParts: SparePart[];
	carsOnParts: CarOnParts[];
}

const Home: NextPage<Props> = ({ page, brands = [], reviews, newSpareParts, carsOnParts }) => {
	console.log(carsOnParts);
	const theme = useTheme();
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.up('md'));
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
	const [productType, setProductType] = useState<ProductType>('sparePart');
	const [isOpenedModal, setIsOpenModal] = useState<boolean>(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	const origin = typeof window !== 'undefined' ? window.location.origin : '';
	const title = typeof window !== 'undefined' ? document.title : '';

	const router = useRouter();

	const loadKindSpareParts = async () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;
		try {
			const { data } = await fetchKindSpareParts(
				{
					pagination: { start: kindSpareParts.data.length }
				},
				{ abortController: controller }
			);
			setKindSpareParts({ data: [...kindSpareParts.data, ...data.data], meta: data.meta });
		} catch (err) {
			if (!axios.isCancel(err)) {
				enqueueSnackbar(
					'Произошла какая-то ошибка при загрузке данных для автозаполнения, попробуйте снова или обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		}
	};

	const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
		setIsLoadingMore(true);
		await loadKindSpareParts();
		setIsLoadingMore(false);
	});

	const { enqueueSnackbar } = useSnackbar();

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;
		try {
			const { data } = await fetchKindSpareParts(
				{ filters: { name: { $contains: value } } },
				{ abortController: controller }
			);
			setKindSpareParts(data);
		} catch (err) {
			if (!axios.isCancel(err)) {
				enqueueSnackbar(
					'Произошла какая-то ошибка при загрузке данных для автозаполнения, попробуйте снова или обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		}
		setIsLoading(false);
	});

	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

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
		setGenerations([]);
	};

	const handleChangeModelAutocomplete = (_: any, selected: { value: string; label: string } | null) => {
		updateValue('model', selected);
		updateValue('generation', null);
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
		setIsLoading(true);
		debouncedFetchKindSparePartsRef(value);
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
		};

	const handleClickFind = () => {
		let url = '/';
		let { brand, model, ...restValues } = values;
		let sanitazedValues = Object.keys(restValues).reduce(
			(prev, curr) => (restValues[curr] ? { ...prev, [curr]: restValues[curr] } : prev),
			{}
		);

		const query = qs.stringify(sanitazedValues, { encode: false });
		const formattedQuery = `${query ? `?${query}` : ''}`;
		if (productType === 'sparePart' || productType === 'cabin') {
			const kindSparePart = kindSpareParts.data.find((item) => item.slug === values.kindSparePart);
			let productTypeSlug = '';
			if (kindSparePart) {
				productTypeSlug = kindSparePart.type === 'regular' ? 'spare-parts' : 'cabins';
			} else {
				productTypeSlug = productType === 'sparePart' ? 'spare-parts' : 'cabins';
			}
			url = `/${productTypeSlug}/${model ? `${brand}/model-${model}` : brand ? `${brand}` : ''}${formattedQuery}`;
		} else if (productType === 'wheel') {
			url = `/wheels/${brand ? `${brand}` : ''}${formattedQuery}`;
		} else if (productType === 'tire') {
			url = `/tires/${brand ? `${brand}` : ''}${formattedQuery}`;
		}

		router.push(url);
	};

	const handleClickOpenFilters = () => {
		setIsOpenModal(true);
	};

	const handleCloseModal = () => {
		setIsOpenModal(false);
	};

	const handleChangeProductType = (_: any, selected: { label: string; value: ProductType }) => {
		setProductType(selected.value);
		setValues({});
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
		placeholder: 'Выбрать запчасть',
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

	const renderProductTypeAutocomplete = (
		<Autocomplete
			disableClearable
			onChange={handleChangeProductType}
			value={productTypeOptions.find((item) => item.value === productType)}
			placeholder='Категория товара'
			options={productTypeOptions}
		></Autocomplete>
	);

	const renderMobileFilters = (
		<Box marginTop='1em'>
			<Box marginTop='0.5em'>
				<Button variant='contained' onClick={handleClickOpenFilters} startIcon={<TuneIcon></TuneIcon>}>
					Найти товары
				</Button>
			</Box>
			<Modal open={isOpenedModal} onClose={handleCloseModal}>
				<Container>
					<Box marginY='2em' bgcolor='#fff'>
						<Box>{renderProductTypeAutocomplete}</Box>
						{filtersConfig[productType].map((item) => {
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
				<Box width={'calc(25% - 0.5em)'}>{renderProductTypeAutocomplete}</Box>
				{filtersConfig[productType].map((item) => {
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
		<Container>
			<Box
				mb={5}
				height={{ xs: 'auto', md: 446 }}
				display={'flex'}
				flexDirection={{ xs: 'column', md: 'row' }}
				gap={2}
			>
				<Box width={{ xs: '100%', md: 360 }}>
					<Typography mb={1} textAlign={'center'} color='textSecondary' variant='h6'>
						Поиск автозапчастей
					</Typography>
					<WhiteBox px={2} py={1} gap={1} withShadow>
						<Tabs sx={{ mb: 2 }} value={'brand'}>
							<Tab label='По марке авто' value={'brand'} />
						</Tabs>
						<Box gap={1} display={'flex'} flexDirection={'column'}>
							<Box display={'flex'} gap={1}>
								<Autocomplete
									options={brandAutocompleteConfig.options}
									noOptionsText={brandAutocompleteConfig.noOptionsText}
									placeholder={brandAutocompleteConfig.placeholder}
									onChange={handleChangeBrandAutocomplete}
									fullWidth
								></Autocomplete>
								<Autocomplete
									options={modelAutocompleteConfig.options}
									noOptionsText={modelAutocompleteConfig.noOptionsText}
									placeholder={modelAutocompleteConfig.placeholder}
									onChange={handleChangeModelAutocomplete}
									onOpen={handleOpenAutocompleteModel}
									disabled={modelAutocompleteConfig.disabled}
									fullWidth
								></Autocomplete>
							</Box>
							<Autocomplete
								options={generationAutocompleteConfig.options}
								noOptionsText={generationAutocompleteConfig.noOptionsText}
								placeholder={generationAutocompleteConfig.placeholder}
								onOpen={handleOpenAutocompleteGeneration}
								onChange={handleChangeAutocomplete('generation')}
								fullWidth
								disabled={generationAutocompleteConfig.disabled}
							></Autocomplete>
							<Autocomplete
								options={kindSparePartAutocompleteConfig.options}
								noOptionsText={kindSparePartAutocompleteConfig.noOptionsText}
								placeholder={kindSparePartAutocompleteConfig.placeholder}
								onChange={handleChangeAutocomplete('kindSparePart')}
								onOpen={handleOpenAutocompleteKindSparePart}
								onInputChange={kindSparePartAutocompleteConfig.onInputChange}
								onScroll={kindSparePartAutocompleteConfig.onScroll}
								fullWidth
							></Autocomplete>
							<Button onClick={handleClickFind} variant='contained'>
								Показать : 150000
							</Button>
							<Button>Сбросить</Button>
						</Box>
					</WhiteBox>
				</Box>
				<Box
					flex={{ xs: 'none', md: '1' }}
					height={{ xs: 234, md: 'auto' }}
					overflow={'hidden'}
					borderRadius={2}
				>
					<Carousel
						className={styles.carousel}
						showDots
						responsive={{
							desktop: {
								breakpoint: { max: 3000, min: 0 },
								items: 1
							}
						}}
					>
						<Box bgcolor={'gray'} width={'100%'} height={'100%'}></Box>
						<Box bgcolor={'gray'} width={'100%'} height={'100%'}></Box>
						<Box bgcolor={'gray'} width={'100%'} height={'100%'}></Box>
					</Carousel>
					;
				</Box>
			</Box>
			<Box mb={5} display={'flex'} gap={1} flexWrap={'wrap'}>
				<WhiteBox
					height={120}
					display={'flex'}
					justifyContent={'end'}
					flexDirection={'column'}
					alignItems={'center'}
					p={1.5}
					flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
				>
					<Typography>Автозапчасти</Typography>
					<Typography color='custom.text-muted'>Без пробега по РБ</Typography>
				</WhiteBox>
				<WhiteBox
					height={120}
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					justifyContent='end'
					p={1.5}
					flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
				>
					<Typography variant='body1'>Доставка</Typography>
					<Typography variant='body2' color='custom.text-muted'>
						Во все регионы РБ
					</Typography>
				</WhiteBox>
				<WhiteBox
					height={120}
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					justifyContent={'end'}
					p={1.5}
					flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
				>
					<Typography variant='body1'>Гарантия</Typography>
					<Typography variant='body2' color='custom.text-muted'>
						На весь ассортимент
					</Typography>
				</WhiteBox>
				<WhiteBox
					height={120}
					display={'flex'}
					flexDirection={'column'}
					justifyContent={'end'}
					alignItems={'center'}
					p={1.5}
					flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
				>
					<Typography variant='body1'>149.000 запчастей</Typography>
					<Typography variant='body2' color='custom.text-muted'>
						В наличии на складе
					</Typography>
				</WhiteBox>
			</Box>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'start'} mb={1}>
				<Box>
					<Typography variant='h6'>Новое поступление</Typography>
					<Typography color='text.primary' variant='body2'>
						Смотреть все Все запчасти находятся на складе и готовы к оперативной отправке
					</Typography>
				</Box>
				<Button variant='link' href='/spare-parts' endIcon={<ChevronRightIcon />}>
					Смотреть все
				</Button>
			</Box>
			<Box mb={5}>
				<Carousel
					autoPlay
					arrows={false}
					responsive={{
						desktop: {
							breakpoint: { max: 3000, min: 0 },
							items: 4
						}
					}}
				>
					{newSpareParts.map((item) => (
						<ProductItem key={item.id} data={item} width={342}></ProductItem>
					))}
				</Carousel>
			</Box>

			<Box mb={5}>
				<Typography variant='h6'>Выберите марку авто</Typography>
				<Typography color='text.primary' variant='body2'>
					Автозапчасти б/у на авторазборке в наличии
				</Typography>
				<Box mt={1} display={'flex'} flexWrap={'wrap'} gap={1}>
					{brands.map((item) => (
						<WhiteBox key={item.id} p={1} height={128} width={110}>
							<LinkWithImage
								width={110}
								height={80}
								caption={item.name}
								link={`/spare-parts/${item.slug}`}
								image={item.image}
								typographyProps={{ fontWeight: 'bold', variant: 'body1' }}
							></LinkWithImage>
						</WhiteBox>
					))}
				</Box>
			</Box>
			<Box mb={1}>
				<Typography variant='h6'>Популярные категории</Typography>
				<Typography color='text.primary' variant='body2'>
					Все запчасти, представленные в каталоге, находятся на складе и готовы к оперативной отправке
				</Typography>
			</Box>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'start'} mb={1}>
				<Box>
					<Typography variant='h6'>Машины на разбор</Typography>
					<Typography color='text.primary' variant='body2'>
						Новые поступление машин на разбор
					</Typography>
				</Box>
				<Button variant='link' href='/awaiting-cars' endIcon={<ChevronRightIcon />}>
					Смотреть все
				</Button>
			</Box>
			<Box mb={5}>
				<Carousel
					arrows={false}
					responsive={{
						desktop: {
							breakpoint: { max: 3000, min: 0 },
							items: 4
						}
					}}
				>
					{carsOnParts.map((item) => (
						<CarItem key={item.id} data={item} width={342}></CarItem>
					))}
				</Carousel>
			</Box>
			<Box
				minHeight={284}
				display={'flex'}
				gap={{ xs: 0, md: 5 }}
				py={4}
				px={2}
				width={{ xs: '110%', md: 'auto' }}
				ml={{ xs: '-5%', md: 0 }}
				flexDirection={{ xs: 'column', md: 'row' }}
				alignItems={'center'}
				justifyContent={'center'}
				bgcolor={'custom.bg-surface-4'}
			>
				<Box maxWidth={340} textAlign={{ xs: 'center', md: 'left' }}>
					<Typography color='text.secondary' variant='h6'>
						Выкуп авто
					</Typography>
					<Typography color='text.primary' mb={2}>
						Оставьте заявку и мы с вами свяжемся для покупки вашего автомобиля{' '}
					</Typography>
					{isTablet ? <ShareButtons origin={origin} title={title} /> : null}
				</Box>
				<Box
					maxWidth={300}
					display={'flex'}
					flexDirection={'column'}
					gap={1}
					textAlign={{ xs: 'center', md: 'left' }}
				>
					<Input size='medium' placeholder='Номер телефона'></Input>
					<Button variant='contained'>Оставить заявку</Button>
					<Typography variant='body2' color='custom.text-muted'>
						Нажимая на кнопку вы соглашаетесь на обработку персональных данных
					</Typography>
				</Box>
			</Box>
		</Container>
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
		reviews: (await fetchReviews()).data.data
	}),
	async () => ({
		newSpareParts: (
			await fetchSpareParts({
				populate: ['images', 'brand', 'volume']
			})
		).data.data
	}),
	async () => ({
		carsOnParts: (await fetchCarsOnParts({ populate: ['images', 'volume', 'brand', 'model', 'generation'] })).data
			.data
	}),
	() => ({ hasGlobalContainer: false, hideSEOBox: true })
);
