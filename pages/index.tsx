import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, CircularProgress, Container, Link } from '@mui/material';

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
import { MAX_LIMIT } from 'api/constants';
import { fetchBrands } from 'api/brands/brands';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getPageProps } from 'services/PagePropsService';
import HeadSEO from 'components/HeadSEO';
import SEOBox from 'components/SEOBox';
import Filters from 'components/Filters';
import styles from './index.module.scss';
import { PageMain } from 'api/pageMain/types';
import WhiteBox from 'components/WhiteBox';
import getConfig from 'next/config';
import LinkWithImage from 'components/LinkWithImage';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { Car } from 'api/cars/types';
import { fetchCars } from 'api/cars/cars';
import { fetchNews } from 'api/news/news';
import { OneNews } from './api/news';
import Typography from 'components/Typography';
import ReactMarkdown from 'components/ReactMarkdown';
import { SparePart } from 'api/spareParts/types';
import EmptyImageIcon from 'components/EmptyImageIcon';
import CarouselProducts from 'components/CarouselProducts';
import Image from 'components/Image';
import { fetchPageMain } from 'api/pageMain/pageMain';

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
	const [spareParts, setSpareParts] = useState<SparePart[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [total, setTotal] = useState<null | number>(null);
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
			setTotal(meta.pagination?.total || 0);
			setSpareParts(data);
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
		router.push({ pathname: router.pathname, query: router.query }, undefined, {shallow: true});
		setModels([]);
	};

	const handleClickFind = () => {};

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

	const renderLinkWithImage = (item: ILinkWithImage) => (
		<WhiteBox key={item.id} textAlign='center'>
			<LinkWithImage
				targetLink='_blank'
				image={item.image}
				link={item.link}></LinkWithImage>
		</WhiteBox>
	);

	const renderLinksWithImages = (items?: ILinkWithImage[]) =>
		items?.map((item) => renderLinkWithImage(item));
	return (
		<>
			<HeadSEO
				title={data.seo?.title || 'Главная'}
				description={data.seo?.description || 'разборка'}
				keywords={data.seo?.keywords || 'главная, разборка'}></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography
						textTransform='capitalize'
						component='h1'
						variant='h4'
						textAlign='center'>
						{data.seo?.h1 ||
							'Магазин запчастей б/у для автомобилей'}
					</Typography>
				</WhiteBox>
				<Box display='flex'>
					<Box
						marginRight='1em'
						component='aside'
						className={styles['sider-left']}>
						<Filters
							config={filtersConfig}
							total={total}
							totalText={`Найдено запчастей`}
							btnText='Перейти в каталог'
							onClickFind={handleClickFind}></Filters>
						{renderLinksWithImages(data.serviceStations)}
						{renderLinksWithImages(data.autocomises)}
						{data.deliveryAuto &&
							renderLinkWithImage(data.deliveryAuto)}
					</Box>
					<Box width='calc(100% - 500px - 2em)' marginRight='1em'>
						{data.banner && (
							<Image
								src={
									publicRuntimeConfig.backendLocalUrl +
									data.banner.url
								}
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
														item.image.formats
															?.thumbnail?.url ||
													item.image.url
												}
												alt={
													item.image.alternativeText
												}></Image>
										</WhiteBox>
									))}
							</Slider>
						</Box>
						{data.textAfterBrands && (
							<WhiteBox>
								<ReactMarkdown
									content={
										data.textAfterBrands
									}></ReactMarkdown>
							</WhiteBox>
						)}
						<Box padding='1em'>
							<CarouselProducts
								data={spareParts}
								slidesToShow={2}></CarouselProducts>
						</Box>
					</Box>
					<Box className={styles['sider-right']}>
						{!!cars.length && (
							<WhiteBox padding='1em 1.5em'>
								<Slider swipe={false}>
									{cars
										.filter((item) => item.images)
										.map((item) => (
											<Slider
												arrows={false}
												key={item.id}
												autoplay
												autoplaySpeed={3000}>
												{item.images?.map((image) => (
													<Image
														alt={
															image.alternativeText
														}
														key={image.id}
														width={208}
														height={156}
														src={
															publicRuntimeConfig.backendLocalUrl +
															image.formats
																?.thumbnail.url
														}></Image>
												))}
											</Slider>
										))}
								</Slider>
							</WhiteBox>
						)}
						{renderLinksWithImages(data.discounts)}
						{renderLinksWithImages(data.advertising)}
						{!!news.length && (
							<WhiteBox padding='1em 1.5em'>
								<Slider autoplay autoplaySpeed={3000}>
									{news.map((item) => (
										<Box key={item.link}>
											<Link
												target='_blank'
												href={item.link}>
												<Typography
													marginBottom='0.5em'
													lineClamp={2}>
													{item.title}
												</Typography>
											</Link>
											<Image
												alt={item.title}
												width={214}
												height={100}
												src={item.imageUrl}></Image>
											<Typography
												textAlign='right'
												color='text.secondary'>
												{new Date(
													item.pubDate
												).toLocaleDateString(
													'ru-RU'
												)}{' '}
												{new Date(
													item.pubDate
												).toLocaleTimeString('ru-RU', {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</Typography>
										</Box>
									))}
								</Slider>
							</WhiteBox>
						)}
					</Box>
				</Box>
				<SEOBox
					images={data.seo?.images}
					content={data.seo?.content}></SEOBox>
			</Container>
		</>
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
