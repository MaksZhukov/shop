import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, Button, CircularProgress, Link, Rating, useMediaQuery } from '@mui/material';

import { Dispatch, SetStateAction, UIEventHandler, useRef, useState } from 'react';
import Slider from 'react-slick';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { ApiResponse } from 'api/types';
import NextLink from 'next/link';
import { fetchBrands } from 'api/brands/brands';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getPageProps } from 'services/PagePropsService';
import WhiteBox from 'components/WhiteBox';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { Car } from 'api/cars/types';
import { fetchCars } from 'api/cars/cars';
import { SparePart } from 'api/spareParts/types';
import Image from 'components/Image';
import Catalog from 'components/Catalog';
import ReactMarkdown from 'components/ReactMarkdown';
import CarouselProducts from 'components/CarouselProducts';
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
import { OFFSET_SCROLL_LOAD_MORE } from '../constants';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import CarouselReviews from 'components/CarouselReviews';

let OFFSET_LOAD_MORE_SLIDER = 3;

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
	loadMoreBrands,
	onScrollBrandsList,
}) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
	const [volumes, setVolumes] = useState<EngineVolume[]>([]);
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

	const { brand = '', model = '' } = router.query as {
		brand: string;
		model: string;
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
		if (selected) {
			router.query.brand = selected;
		} else {
			delete router.query.brand;
			delete router.query.model;
			delete router.query.generation;
		}
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
		setModels([]);
		setGenerations([]);
	};

	const handleChangeModelAutocomplete = (_: any, selected: string | null) => {
		if (selected) {
			router.query.model = selected;
		} else {
			delete router.query.model;
			delete router.query.generation;
		}
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
		setGenerations([]);
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const handleOpenAutocompleteModel = () =>
		handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
			fetchModels({
				filters: { brand: { name: brand } },
				pagination: { limit: MAX_LIMIT },
			})
		);

	const handleOpenAutocompleteGeneration = () =>
		handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
			fetchGenerations({
				filters: { model: { name: model } },
				pagination: { limit: MAX_LIMIT },
			})
		);

	const handleOpenAutocompleteKindSparePart = () => async () => {
		if (!kindSpareParts.data.length) {
			setIsLoading(true);
			await loadKindSpareParts();
			setIsLoading(false);
		}
	};

	const handleOpenAutocompleteVolume = () =>
		handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
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

	const filtersConfig = getSparePartsFiltersConfig({
		storeInUrlIds: ['volume', 'bodyStyle', 'kindSparePart', 'transmission', 'fuel'],
		brands: brands.data,
		models,
		kindSpareParts: kindSpareParts.data,
		generations,
		noOptionsText,
		volumes,
		isLoadingMoreKindSpareParts: isLoadingMore,
		onScrollBrandAutocomplete: onScrollBrandsList,
		onScrollKindSparePartAutocomplete: handleScrollKindSparePartAutocomplete,
		onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
		onChangeModelAutocomplete: handleChangeModelAutocomplete,
		onInputChangeKindSparePart: handleInputChangeKindSparePart,
		onOpenAutocompleteModel: handleOpenAutocompleteModel,
		onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
		onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
		onOpenAutoCompleteVolume: handleOpenAutocompleteVolume,
	});
	const filtersBtn = (
		<NextLink
			href={`/spare-parts${brand ? `/${brand}${router.asPath.replace(`brand=${brand}`, '')}` : router.asPath}`}
		>
			<Button fullWidth variant='contained'>
				Перейти в каталог
			</Button>
		</NextLink>
	);

	const slidesToShow = isTablet ? 1 : 3;

	const beforeChange = async (index: number) => {
		if (brands.data.length === index + slidesToShow + OFFSET_LOAD_MORE_SLIDER) {
			await loadMoreBrands();
		}
	};

	const middleContent = (
		<>
			{page.banner && (
				<Image
					src={page.banner.url}
					alt={page.banner.alternativeText}
					width={640}
					height={640}
					quality={100}
					style={{ height: 'auto' }}
				></Image>
			)}
			<Box padding='1em 1.5em'>
				<Slider
					className={styles.slider}
					autoplay
					autoplaySpeed={3000}
					beforeChange={beforeChange}
					slidesToShow={slidesToShow}
				>
					{brands.data
						.filter((item) => item.image)
						.map((item) => (
							<WhiteBox marginX='0.5em' key={item.id}>
								<NextLink href={`/spare-parts/${item.slug}`}>
									<Image
										width={156}
										height={156}
										src={item.image?.formats?.thumbnail?.url || item.image?.url}
										alt={item.image?.alternativeText}
										style={isTablet ? { margin: 'auto' } : {}}
									></Image>
								</NextLink>
							</WhiteBox>
						))}
				</Slider>
			</Box>
			{page.textAfterBrands && (
				<WhiteBox>
					<ReactMarkdown content={page.textAfterBrands}></ReactMarkdown>
				</WhiteBox>
			)}
			<Box>
				<CarouselProducts data={spareParts.data} slidesToShow={2}></CarouselProducts>
			</Box>
			<Box>
				<Typography component='h4' variant='h5' textAlign='center' gutterBottom>
					Отзывы
				</Typography>
				<CarouselReviews data={reviews} slidesToShow={isTablet ? 1 : 2}></CarouselReviews>
			</Box>
		</>
	);

	return (
		<Catalog
			seo={page.seo}
			serviceStations={page.serviceStations}
			advertising={page.advertising}
			autocomises={page.autocomises}
			cars={cars}
			deliveryAuto={page.deliveryAuto}
			discounts={page.discounts}
			articles={articles}
			filtersBtn={filtersBtn}
			filtersConfig={filtersConfig}
			middleContent={middleContent}
			{...(spareParts.meta?.pagination?.total
				? { textTotal: `Найдено запчастей: ${spareParts.meta?.pagination?.total}` }
				: {})}
		></Catalog>
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
	})
);
