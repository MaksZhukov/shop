import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, Button, CircularProgress } from '@mui/material';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
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
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';
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
}

const Home: NextPage<Props> = ({
	page,
	cars = [],
	articles = [],
	brands = [],
	autocomises = [],
	serviceStations = [],
}) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [spareParts, setSpareParts] = useState<SparePart[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		const {
			data: { data },
		} = await fetchKindSpareParts({ filters: { name: { $contains: value } } });
		setKindSpareParts(data);
	});
	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

	useEffect(() => {
		const fetchData = async () => {
			const {
				data: { meta, data },
			} = await fetchSpareParts({
				sort: 'createdAt:desc',
				populate: ['images'],
			});
			setSpareParts(data);
			setTotal(meta.pagination?.total || null);
		};
		fetchData();
	}, []);

	const { brandId = '', modelId = '' } = router.query as {
		brandId: string;
		modelId: string;
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

	const handleChangeBrandAutocomplete = (_: any, selected: Brand | null) => {
		if (selected) {
			router.query.brandName = selected.name.toString();
			router.query.brandId = selected.id.toString();
		} else {
			delete router.query.brandName;
			delete router.query.brandId;
			delete router.query.modelName;
			delete router.query.modelId;
			delete router.query.generationId;
			delete router.query.generationName;
		}
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
		setModels([]);
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
		fetchModels({
			filters: { brand: brandId as string },
			pagination: { limit: MAX_LIMIT },
		})
	);

	const handleOpenAutocompleteGeneration = handleOpenAutocomplete<Generation>(
		!!generations.length,
		setGenerations,
		() =>
			fetchGenerations({
				filters: { model: modelId as string },
				pagination: { limit: MAX_LIMIT },
			})
	);

	const handleOpenAutocompleteKindSparePart = handleOpenAutocomplete<KindSparePart>(
		!!kindSpareParts.length,
		setKindSpareParts,
		() =>
			fetchKindSpareParts({
				pagination: { limit: MAX_LIMIT },
			})
	);

	const hangleInputChangeKindSparePart = (_: any, value: string) => {
		debouncedFetchKindSparePartsRef(value);
	};

	const filtersConfig = getSparePartsFiltersConfig({
		brands,
		models,
		kindSpareParts,
		generations,
		modelId,
		brandId,
		noOptionsText,
		onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
		onInputChangeKindSparePart: hangleInputChangeKindSparePart,
		onOpenAutocompleteModel: handleOpenAutocompleteModel,
		onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
		onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
	});

	const filtersBtn = (
		<NextLink href={`/spare-parts${router.asPath}`}>
			<Button fullWidth variant='contained'>
				Перейти в каталог
			</Button>
		</NextLink>
	);

	const middleContent = (
		<>
			{page.banner && (
				<Image src={page.banner.url} alt={page.banner.alternativeText} width={640} height={640}></Image>
			)}
			<Box padding='1em 1.5em'>
				<Slider slidesToShow={3}>
					{brands
						.filter((item) => item.image)
						.map((item) => (
							<WhiteBox marginX='0.5em' key={item.id}>
								<Image
									width={156}
									height={156}
									src={item.image?.formats?.thumbnail?.url || item.image?.url}
									alt={item.image?.alternativeText}
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
				<CarouselProducts data={spareParts} slidesToShow={2}></CarouselProducts>
			</Box>
		</>
	);

	return (
		<Catalog
			seo={page.seo}
			serviceStations={serviceStations}
			advertising={page.advertising}
			autocomises={autocomises}
			cars={cars}
			deliveryAuto={page.deliveryAuto}
			discounts={page.discounts}
			articles={articles}
			filtersBtn={filtersBtn}
			filtersConfig={filtersConfig}
			middleContent={middleContent}
			{...(total ? { textTotal: `Найдено запчастей: ${total}` } : {})}
		></Catalog>
	);
};

export default Home;

export const getServerSideProps = getPageProps(
	fetchPage('main'),
	async () => ({
		autocomises: (await fetchAutocomises({ populate: 'image' }, true)).data.data,
	}),
	async () => ({
		serviceStations: (await fetchServiceStations({ populate: 'image' }, true)).data.data,
	}),
	async () => {
		const { data } = await fetchCars({ populate: ['images'], pagination: { limit: 10 } }, true);
		return { cars: data.data };
	},
	async () => ({
		articles: (await fetchArticles({ populate: 'image' }, true)).data.data,
	}),
	async () => {
		const { data } = await fetchBrands(
			{
				populate: 'image',
				pagination: { limit: MAX_LIMIT },
			},
			true
		);
		return { brands: data.data };
	}
);
