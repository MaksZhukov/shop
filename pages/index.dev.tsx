import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, Button, CircularProgress, Link, useMediaQuery } from '@mui/material';

import { Dispatch, SetStateAction, UIEventHandler, useRef, useState } from 'react';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { ApiResponse } from 'api/types';
import { fetchBrands } from 'api/brands/brands';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getPageProps } from 'services/PagePropsService';
import { Car } from 'api/cars/types';
import { fetchCars } from 'api/cars/cars';
import { SparePart } from 'api/spareParts/types';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { MAX_LIMIT } from 'api/constants';
import { useDebounce, useThrottle } from 'rooks';
import { fetchPage } from 'api/pages';
import { PageMain } from 'api/pages/types';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import styles from './index.module.scss';
import { BODY_STYLES, FUELS, OFFSET_SCROLL_LOAD_MORE, TRANSMISSIONS } from '../constants';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import CarouselReviews from 'components/CarouselReviews';
import { Container } from '@mui/system';
import Filters from 'components/Filters';
import Autocomplete from 'components/Autocomplete';
import qs from 'qs';
import Image from 'components/Image';
import NextLink from 'next/link';
import LinkWithImage from 'components/LinkWithImage';
import WhiteBox from 'components/WhiteBox';

const CATEGORIES = [
	{ id: 'wheel', href: '/wheels', imgSrc: '/wheels.png', name: 'Колеса', imgWidth: 180, imgHeight: 180 },
	{ id: 'cabin', href: '/cabins', imgSrc: '/cabins.png', name: 'Салоны', imgWidth: 180, imgHeight: 237 },
	{
		id: 'sparePart',
		href: '/spare-parts',
		name: 'Запчасти',
		imgSrc: '/spare_parts.png',
		imgWidth: 180,
		imgHeight: 136,
	},
	{ id: 'tire', href: '/tires', name: 'Колеса', imgSrc: '/tires.png', imgWidth: 180, imgHeight: 201 },
];

const ADVANTAGES = ['/advantage_1.png', '/advantage_2.png', '/advantage_3.png', '/advantage_4.png', '/advantage_5.png'];

interface Props {
	page: PageMain;
	cars: Car[];
	reviews: Review[];
	autocomises: Autocomis[];
	serviceStations: ServiceStation[];
	articles: Article[];
	brands: ApiResponse<Brand[]>;
	spareParts: ApiResponse<SparePart[]>;
	loadMoreBrands: () => void;
	onScrollBrandsList: UIEventHandler<HTMLUListElement>;
}

const Home: NextPage<Props> = ({
	page,
	cars = [],
	articles = [],
	brands = { data: [] },
	spareParts,
	reviews,
	serviceStations,
	autocomises,
	loadMoreBrands,
	onScrollBrandsList,
}) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
	const [volumes, setVolumes] = useState<EngineVolume[]>([]);
	const [values, setValues] = useState<{ [key: string]: string | null }>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const router = useRouter();

	const loadKindSpareParts = async () => {
		const { data } = await fetchKindSpareParts({
			pagination: { start: kindSpareParts.data.length },
		});
		setKindSpareParts({ data: [...kindSpareParts.data, ...data.data], meta: data.meta });
	};

	const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
		setIsLoadingMore(true);
		await loadKindSpareParts();
		setIsLoadingMore(false);
	});
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const { enqueueSnackbar } = useSnackbar();

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		setIsLoading(true);
		const { data } = await fetchKindSpareParts({ filters: { name: { $contains: value } } });
		setKindSpareParts(data);
		setIsLoading(false);
	});
	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

	const updateValue = (id: string, selected: { value: string } | string | null) => {
		let value = typeof selected === 'string' ? selected : selected?.value || null;
		setValues({ ...values, [id]: value });
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

	const handleChangeBrandAutocomplete = (_: any, selected: string | null) => {
		updateValue('brand', selected);
		setModels([]);
		setGenerations([]);
	};

	const handleChangeModelAutocomplete = (_: any, selected: string | null) => {
		updateValue('model', selected);
		setGenerations([]);
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;
	const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
		fetchModels({
			filters: { brand: { slug: values.brand } },
			pagination: { limit: MAX_LIMIT },
		})
	);

	const handleOpenAutocompleteGeneration = handleOpenAutocomplete<Generation>(
		!!generations.length,
		setGenerations,
		() =>
			fetchGenerations({
				filters: { model: { name: values.model } },
				pagination: { limit: MAX_LIMIT },
			})
	);

	const handleOpenAutocompleteKindSparePart = async () => {
		if (!kindSpareParts.data.length) {
			setIsLoading(true);
			await loadKindSpareParts();
			setIsLoading(false);
		}
	};

	const handleOpenAutocompleteVolume = handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
		fetchEngineVolumes({
			pagination: { limit: MAX_LIMIT },
		})
	);

	const handleInputChangeKindSparePart = (_: any, value: string) => {
		debouncedFetchKindSparePartsRef(value);
	};

	const handleScrollKindSparePartAutocomplete: UIEventHandler<HTMLUListElement> = (event) => {
		if (
			event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
			event.currentTarget.scrollHeight
		) {
			throttledLoadMoreKindSpareParts();
		}
	};

	const handleChangeAutocomplete = (id: string) => (_: any, selected: { value: string } | string | null) => {
		updateValue(id, selected);
	};

	const handleClickFind = () => {
		let { brand, ...restValues } = values;
		router.push(`/spare-parts/${brand || ''}?` + qs.stringify(restValues, { encode: false }));
	};

	const handleClickBuyback = () => {
		router.push('/buyback-cars');
	};

	const filtersConfig = [
		{
			id: 'brand',
			placeholder: 'Марка',
			options: brands.data.map((item) => ({ label: item.name, value: item.slug })),
			onChange: handleChangeBrandAutocomplete,
			onScroll: loadMoreBrands,
			noOptionsText: noOptionsText,
		},

		{
			id: 'model',
			placeholder: 'Модель',
			disabled: !values.brand,
			options: models.map((item) => item.name),
			onChange: handleChangeModelAutocomplete,
			onOpen: handleOpenAutocompleteModel,
			noOptionsText: noOptionsText,
		},

		{
			id: 'generation',
			placeholder: 'Поколение',
			disabled: !values.model,
			options: generations.map((item) => item.name),
			onOpen: handleOpenAutocompleteGeneration,
			noOptionsText: noOptionsText,
		},

		{
			id: 'kindSparePart',
			placeholder: 'Запчасть',
			options: kindSpareParts.data.map((item) => item.name),
			loadingMore: isLoadingMore,
			onScroll: handleScrollKindSparePartAutocomplete,
			onOpen: handleOpenAutocompleteKindSparePart,
			onInputChange: handleInputChangeKindSparePart,
			noOptionsText: noOptionsText,
		},

		{
			id: 'volume',
			placeholder: 'Обьем 2.0',
			options: volumes.map((item) => item.name),
			onOpen: handleOpenAutocompleteVolume,
			noOptionsText: noOptionsText,
		},

		{
			id: 'bodyStyle',
			placeholder: 'Кузов',
			options: BODY_STYLES,
		},

		{
			id: 'transmission',
			placeholder: 'Коробка',
			type: 'autocomplete',
			options: TRANSMISSIONS,
		},

		{
			id: 'fuel',
			placeholder: 'Тип топлива',
			options: FUELS,
		},
	];

	return (
		<>
			<Box className={styles['head-section']}>
				<Container sx={{ height: '100%', position: 'relative' }}>
					<Box className={styles['head-text']}>
						<Typography fontWeight='bold' component='h1' variant='h3'>
							МАГАЗИН ЗАПЧАСТЕЙ <br></br> ДЛЯ Б/У АВТОМОБИЛЕЙ{' '}
						</Typography>
						<Typography component='h2' variant='h4'>
							У нас найдется все!
						</Typography>
					</Box>
					<Box display='flex' width='100%' position='absolute' bottom='4em' className={styles['head-search']}>
						<Box display='flex' gap='0.5em' flex='1' flexWrap='wrap' className={styles.filters}>
							{filtersConfig.map((item) => {
								return (
									<Box width={'calc(25% - 0.5em)'} key={item.id}>
										<Autocomplete
											width
											// className={styles.filters__item}
											options={item.options}
											noOptionsText={item.noOptionsText}
											onOpen={item.onOpen}
											placeholder={item.placeholder}
											onChange={item.onChange || handleChangeAutocomplete(item.id)}
											fullWidth
											onInputChange={item.onInputChange}
											disabled={item.disabled}
											// value={values[item.id] || null}
										></Autocomplete>
									</Box>
								);
							})}
						</Box>
						<Button onClick={handleClickFind} variant='contained' className={styles['btn-search']}>
							Поиск
						</Button>
					</Box>
				</Container>
			</Box>
			<Container>
				<Typography
					withSeparator
					component='h2'
					variant='h4'
					marginBottom='1.5em'
					fontWeight='bold'
					textTransform='uppercase'
				>
					Рекомендуемые товары
				</Typography>
				<Box className={styles.categories} marginBottom='2em' display='flex'>
					{CATEGORIES.map((item) => (
						<Box key={item.id} className={styles.categories__item}>
							<Box display='flex' alignItems='center' justifyContent='center' minHeight='250px'>
								<Image
									isOnSSR={false}
									src={item.imgSrc}
									width={item.imgWidth}
									height={item.imgHeight}
									alt={item.name}
								></Image>
							</Box>
							<Typography marginBottom='0.5em' textAlign='center' variant='h4'>
								<NextLink href={item.href}>
									<Link component='span' underline='hover' color='inherit'>
										{item.name}
									</Link>
								</NextLink>
							</Typography>
						</Box>
					))}
					<Box
						sx={{ cursor: 'pointer' }}
						component='a'
						onClick={handleClickBuyback}
						className={styles.categories__item}
					></Box>
				</Box>
				<Box marginBottom='3em' justifyContent='space-between' display='flex'>
					{ADVANTAGES.map((item) => (
						<Image isOnSSR={false} src={item} key={item} alt={item} width={200} height={140}></Image>
					))}
				</Box>
				<Box display='flex' gap={'2em'} marginBottom='4em' justifyContent='space-between'>
					{page.serviceStations?.map((item) => (
						<WhiteBox width='25%' key={item.id}>
							<LinkWithImage
								height={100}
								image={item.image}
								link={`/service-stations/${item.slug}`}
							></LinkWithImage>
						</WhiteBox>
					))}
					{page.autocomises?.map((item) => (
						<WhiteBox width='25%' key={item.id}>
							<LinkWithImage
								height={100}
								image={item.image}
								link={`/autocomises/${item.slug}`}
							></LinkWithImage>
						</WhiteBox>
					))}
				</Box>
				<Box marginBottom='4em'>
					<Typography
						withSeparator
						component='h2'
						variant='h4'
						marginBottom='1.5em'
						fontWeight='bold'
						textTransform='uppercase'
					>
						У нас вы сможете найти запчасти <br></br> на самые популярные марки авто.
					</Typography>
				</Box>
				<Box display='flex' marginBottom='4em' gap={'0.5em'} flexWrap='wrap'>
					{brands.map((item) => (
						<WhiteBox width={137} padding='1em 0.5em' key={item.id}>
							<LinkWithImage
								width={100}
								height={40}
								caption={item.name}
								link={`/spare-parts/${item.slug}`}
								image={item.image}
								linkProps={{ fontWeight: 'bold', variant: 'body1' }}
							></LinkWithImage>
						</WhiteBox>
					))}
				</Box>
			</Container>
		</>
	);
};

export default Home;

export const getServerSideProps = getPageProps(
	fetchPage('main'),
	async () => {
		const { data } = await fetchCars({ populate: ['images'], pagination: { limit: 10 } });
		return { cars: data.data };
	},
	async () => ({
		articles: (await fetchArticles({ populate: 'image' })).data.data,
	}),
	async () => ({
		brands: (
			await fetchBrands({
				populate: 'image',
				pagination: { limit: MAX_LIMIT },
			})
		).data,
	}),
	async () => ({
		spareParts: (
			await fetchSpareParts({
				filters: {
					price: { $gt: 0 },
				},
				sort: 'createdAt:desc',
				pagination: { limit: 10 },
				populate: ['images', 'brand'],
			})
		).data,
	}),
	async () => ({
		reviews: (await fetchReviews()).data.data,
	}),
	() => ({ hasGlobalContainer: false })
);
