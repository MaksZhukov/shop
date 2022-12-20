import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, Button, CircularProgress, useMediaQuery } from '@mui/material';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
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
import { useDebounce } from 'rooks';
import { fetchPage } from 'api/pages';
import { PageMain } from 'api/pages/types';

interface Props {
	page: PageMain;
	cars: Car[];
	autocomises: Autocomis[];
	serviceStations: ServiceStation[];
	articles: Article[];
	brands: Brand[];
	spareParts: ApiResponse<SparePart[]>;
}

const Home: NextPage<Props> = ({ page, cars = [], articles = [], brands = [], spareParts }) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const { enqueueSnackbar } = useSnackbar();

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		const {
			data: { data },
		} = await fetchKindSpareParts({ filters: { name: { $contains: value } } });
		setKindSpareParts(data);
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

	const handleOpenAutocompleteKindSparePart = () =>
		handleOpenAutocomplete<KindSparePart>(!!kindSpareParts.length, setKindSpareParts, () =>
			fetchKindSpareParts({
				pagination: { limit: MAX_LIMIT },
			})
		);

	const hangleInputChangeKindSparePart = (_: any, value: string) => {
		debouncedFetchKindSparePartsRef(value);
	};

	const filtersConfig = getSparePartsFiltersConfig({
		storeInUrlIds: ['volume', 'bodyStyle', 'kindSparePart', 'transmission', 'fuel'],
		brands,
		models,
		kindSpareParts,
		generations,
		noOptionsText,
		onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
		onChangeModelAutocomplete: handleChangeModelAutocomplete,
		onInputChangeKindSparePart: hangleInputChangeKindSparePart,
		onOpenAutocompleteModel: handleOpenAutocompleteModel,
		onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
		onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
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

	const middleContent = (
		<>
			{page.banner && (
				<Image
					src={page.banner.url}
					alt={page.banner.alternativeText}
					width={640}
					height={640}
					style={{ height: 'auto' }}
				></Image>
			)}
			<Box padding='1em 1.5em'>
				<Slider slidesToShow={isTablet ? 1 : 3}>
					{brands
						.filter((item) => item.image)
						.map((item) => (
							<WhiteBox marginX='0.5em' key={item.id}>
								<Image
									width={156}
									height={156}
									src={item.image?.formats?.thumbnail?.url || item.image?.url}
									alt={item.image?.alternativeText}
									style={isTablet ? { margin: 'auto' } : {}}
								></Image>
							</WhiteBox>
						))}
				</Slider>
			</Box>
			{page.textAfterBrands && (
				<WhiteBox>
					<ReactMarkdown content={page.textAfterBrands}></ReactMarkdown>
				</WhiteBox>
			)}
			<Box padding='1em'>
				<CarouselProducts data={spareParts.data} slidesToShow={2}></CarouselProducts>
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
				pagination: { limit: MAX_LIMIT },
			})
		).data.data,
	}),
	async () => ({
		spareParts: (
			await fetchSpareParts({
				sort: 'createdAt:desc',
				populate: ['images', 'brand'],
			})
		).data,
	})
);
