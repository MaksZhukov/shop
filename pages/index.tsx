import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, Button, CircularProgress, Container, Link } from '@mui/material';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import {
	ApiResponse,
	Filters as IFilters,
	LinkWithImage as ILinkWithImage,
} from 'api/types';
import NextLink from 'next/link';
import { MAX_LIMIT } from 'api/constants';
import { fetchBrands } from 'api/brands/brands';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getPageProps } from 'services/PagePropsService';
import { PageMain } from 'api/pageMain/types';
import WhiteBox from 'components/WhiteBox';
import getConfig from 'next/config';
import LinkWithImage from 'components/LinkWithImage';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { Car } from 'api/cars/types';
import { fetchCars } from 'api/cars/cars';
import { fetchNews } from 'api/news/news';
import Typography from 'components/Typography';
import { SparePart } from 'api/spareParts/types';
import EmptyImageIcon from 'components/EmptyImageIcon';
import Image from 'components/Image';
import { fetchPageMain } from 'api/pageMain/pageMain';
import Catalog from 'components/Catalog';
import { OneNews } from 'api/news/types';
import ReactMarkdown from 'components/ReactMarkdown';
import CarouselProducts from 'components/CarouselProducts';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: PageMain;
	cars: Car[];
	news: OneNews[];
	brands: Brand[];
}

const Home: NextPage<Props> = ({ data, cars = [], news = [], brands = [] }) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [spareParts, setSpareParts] = useState<SparePart[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
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
		router.push(
			{ pathname: router.pathname, query: router.query },
			undefined,
			{ shallow: true }
		);
		setModels([]);
	};

	const noOptionsText = isLoading ? (
		<CircularProgress size={20} />
	) : (
		<>Совпадений нет</>
	);

	const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(
		!!models.length,
		setModels,
		() =>
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

	const handleOpenAutocompleteKindSparePart =
		handleOpenAutocomplete<KindSparePart>(
			!!kindSpareParts.length,
			setKindSpareParts,
			() =>
				fetchKindSpareParts({
					pagination: { limit: MAX_LIMIT },
				})
		);

	const filtersConfig = getSparePartsFiltersConfig({
		brands,
		models,
		kindSpareParts,
		generations,
		modelId,
		brandId,
		noOptionsText,
		onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
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
			{data.banner && (
				<Image
					src={publicRuntimeConfig.backendLocalUrl + data.banner.url}
					alt={data.banner.alternativeText}
					width={640}
					height={640}></Image>
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
									src={
										publicRuntimeConfig.backendLocalUrl +
											item.image.formats?.thumbnail
												?.url || item.image.url
									}
									alt={item.image.alternativeText}></Image>
							</WhiteBox>
						))}
				</Slider>
			</Box>
			{data.textAfterBrands && (
				<WhiteBox>
					<ReactMarkdown
						content={data.textAfterBrands}></ReactMarkdown>
				</WhiteBox>
			)}
			<Box padding='1em'>
				<CarouselProducts
					data={spareParts}
					slidesToShow={2}></CarouselProducts>
			</Box>
		</>
	);

	return (
		<Catalog
			seo={data.seo}
			serviceStations={data.serviceStations}
			advertising={data.advertising}
			autocomises={data.autocomises}
			cars={cars}
			deliveryAuto={data.deliveryAuto}
			discounts={data.discounts}
			news={news}
			filtersBtn={filtersBtn}
			filtersConfig={filtersConfig}
			middleContent={middleContent}
			{...(total
				? { textTotal: `Найдено запчастей: ${total}` }
				: {})}></Catalog>
	);
};

export default Home;

export const getServerSideProps = getPageProps(
	fetchPageMain,
	async () => {
		const { data } = await fetchCars(
			{ populate: ['images'], pagination: { limit: 10 } },
			true
		);
		return { cars: data.data };
	},
	async () => {
		const { data } = await fetchNews();
		return { news: data.data };
	},
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
