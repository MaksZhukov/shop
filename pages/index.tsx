import { Box, CircularProgress, Input, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
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
import { ApiResponse, ProductType } from 'api/types';
import axios, { AxiosResponse } from 'axios';
import Autocomplete from 'components/Autocomplete';
import Image from 'components/Image';
import LinkWithImage from 'components/LinkWithImage';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { BODY_STYLES_SLUGIFY, FUELS_SLUGIFY, TRANSMISSIONS_SLUGIFY } from 'config';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import qs from 'qs';
import { Dispatch, ReactNode, SetStateAction, UIEventHandler, useRef, useState } from 'react';
import { useDebounce, useThrottle } from 'rooks';
import { getPageProps } from 'services/PagePropsService';
import { BODY_STYLES, FUELS, KIND_WHEELS, OFFSET_SCROLL_LOAD_MORE, SEASONS, TRANSMISSIONS } from '../constants';
import styles from './index.module.scss';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from 'components/Icons';
import { Button, Link } from 'components/ui';
import ProductItem from 'components/ProductItem';
import { SocialButtons } from 'components/features/SocialsButtons';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import CarItem from 'components/CarItem';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { fetchEngineVolumes } from 'api/engineVolumes/engineVolumes';
import { EngineVolume } from 'api/engineVolumes/types';
import Carousel from 'react-multi-carousel';
import { Articles } from 'components/features/main/Articles/Articles';

interface Props {
	page: PageMain;
	reviews: Review[];
	brands: Brand[];
	newSpareParts: SparePart[];
	carsOnParts: CarOnParts[];
	articles: Article[];
}

const Home: NextPage<Props> = ({ page, brands = [], reviews, newSpareParts, carsOnParts, articles }) => {
	const theme = useTheme();
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const [isMoreFilters, setIsMoreFilters] = useState<boolean>(false);

	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
	const [engineVolumes, setEngineVolumes] = useState<EngineVolume[]>([]);
	const [values, setValues] = useState<{ [key: string]: string | null }>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const abortControllerRef = useRef<AbortController | null>(null);

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

	const handleOpenEngineVolumeAutocomplete = handleOpenAutocomplete<EngineVolume>(
		!!engineVolumes.length,
		setEngineVolumes,
		() => fetchEngineVolumes({ pagination: { limit: API_MAX_LIMIT } })
	);

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

		const kindSparePart = kindSpareParts.data.find((item) => item.slug === values.kindSparePart);
		let productTypeSlug = '';
		if (kindSparePart) {
			productTypeSlug = kindSparePart.type === 'regular' ? 'spare-parts' : 'cabins';
		} else {
			productTypeSlug = 'spare-parts';
		}
		url = `/${productTypeSlug}/${model ? `${brand}/model-${model}` : brand ? `${brand}` : ''}${formattedQuery}`;

		router.push(url);
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

	return (
		<Container>
			<Box
				mb={5}
				minHeight={{ xs: 'auto', md: 446 }}
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
							<Button
								size='small'
								sx={{ alignSelf: 'flex-start' }}
								onClick={() => setIsMoreFilters(!isMoreFilters)}
								endIcon={isMoreFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
							>
								{isMoreFilters ? 'Меньше параметров' : 'Больше параметров поиска'}
							</Button>
							{isMoreFilters && (
								<>
									<Autocomplete
										options={engineVolumes.map((item) => ({
											label: item.name,
											value: item.name
										}))}
										noOptionsText={noOptionsText}
										placeholder='Объем двигателя'
										onChange={handleChangeAutocomplete('engineVolume')}
										onOpen={handleOpenEngineVolumeAutocomplete}
										fullWidth
									></Autocomplete>
									<Autocomplete
										options={FUELS.map((item) => ({
											label: item,
											value: FUELS_SLUGIFY[item]
										}))}
										noOptionsText={noOptionsText}
										placeholder='Тип топлива'
										onChange={handleChangeAutocomplete('fuel')}
										fullWidth
									></Autocomplete>
									<Autocomplete
										options={BODY_STYLES.map((item) => ({
											label: item,
											value: BODY_STYLES_SLUGIFY[item]
										}))}
										noOptionsText={noOptionsText}
										placeholder='Кузов'
										onChange={handleChangeAutocomplete('bodyStyle')}
										fullWidth
									></Autocomplete>
									<Autocomplete
										options={TRANSMISSIONS.map((item) => ({
											label: item,
											value: TRANSMISSIONS_SLUGIFY[item]
										}))}
										noOptionsText={noOptionsText}
										placeholder='Коробка'
										onChange={handleChangeAutocomplete('transmission')}
										fullWidth
									></Autocomplete>
								</>
							)}
							<Button onClick={handleClickFind} variant='contained'>
								Показать : 150000
							</Button>
						</Box>
					</WhiteBox>
				</Box>
				<Box
					flex={{ xs: 'none', md: '1' }}
					height={{ xs: 234, md: '446px' }}
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
				<Box textAlign={{ xs: 'center', md: 'left' }}>
					<Typography variant='h6'>Новое поступление</Typography>
					<Typography color='text.primary' variant='body2'>
						Смотреть все Все запчасти находятся на складе и готовы к оперативной отправке
					</Typography>
				</Box>
				<Button
					sx={{ display: { xs: 'none', md: 'flex' } }}
					variant='link'
					href='/spare-parts'
					endIcon={<ChevronRightIcon />}
				>
					Смотреть все
				</Button>
			</Box>
			<Box mb={5}>
				<Carousel
					autoPlay={true}
					arrows={false}
					responsive={{
						desktop: {
							breakpoint: { max: 3000, min: 1450 },
							items: 4
						},
						laptop: {
							breakpoint: { max: 1450, min: 1024 },
							items: 3
						},
						tablet: {
							breakpoint: { max: 1024, min: 768 },
							items: 2
						},
						mobile: {
							breakpoint: { max: 768, min: 0 },
							items: 1
						}
					}}
				>
					{newSpareParts.map((item) => (
						<ProductItem key={item.id} data={item} width={342}></ProductItem>
					))}
				</Carousel>
			</Box>

			<Box mb={5}>
				<Typography textAlign={{ xs: 'center', md: 'left' }} variant='h6'>
					Выберите марку авто
				</Typography>
				<Typography textAlign={{ xs: 'center', md: 'left' }} color='text.primary' variant='body2'>
					Автозапчасти б/у на авторазборке в наличии
				</Typography>
				<Box
					mt={1}
					display={'flex'}
					justifyContent={{ xs: 'center', md: 'flex-start' }}
					flexWrap={'wrap'}
					gap={1}
				>
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
			<Box textAlign={{ xs: 'center', md: 'left' }} mb={1}>
				<Typography variant='h6'>Популярные категории</Typography>
				<Typography color='text.primary' variant='body2'>
					Все запчасти, представленные в каталоге, находятся на складе и готовы к оперативной отправке
				</Typography>
			</Box>
			<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} mb={5} gap={1}>
				{/* Column 1 - 2 WhiteBox */}
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>

				{/* Column 2 - 1 WhiteBox */}
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 416 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>

				{/* Column 3 - 2 WhiteBox */}
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>

				{/* Column 4 - 1 WhiteBox */}
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 416 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>
			</Box>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'start'} mb={1}>
				<Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
					<Typography variant='h6'>Машины на разбор</Typography>
					<Typography textAlign={{ xs: 'center', md: 'left' }} color='text.primary' variant='body2'>
						Новые поступление машин на разбор
					</Typography>
				</Box>
				<Button
					sx={{ display: { xs: 'none', md: 'flex' } }}
					variant='link'
					href='/awaiting-cars'
					endIcon={<ChevronRightIcon />}
				>
					Смотреть все
				</Button>
			</Box>
			<Box mb={5}>
				<Carousel
					arrows={false}
					responsive={{
						desktop: {
							breakpoint: { max: 3000, min: 1450 },
							items: 4
						},
						laptop: {
							breakpoint: { max: 1450, min: 1024 },
							items: 3
						},
						tablet: {
							breakpoint: { max: 1024, min: 768 },
							items: 2
						},
						mobile: {
							breakpoint: { max: 768, min: 0 },
							items: 1
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
				mb={5}
				display={'flex'}
				gap={{ xs: 0, md: 5 }}
				py={4}
				px={2}
				width={{ xs: '110%', md: 'auto' }}
				ml={{ xs: '-5%', md: 0 }}
				flexDirection={{ xs: 'column', md: 'row' }}
				alignItems={'center'}
				justifyContent={'center'}
				borderRadius={4}
				bgcolor={'custom.bg-surface-4'}
			>
				<Box maxWidth={340} textAlign={{ xs: 'center', md: 'left' }}>
					<Typography color='text.secondary' variant='h6'>
						Выкуп авто
					</Typography>
					<Typography color='text.primary' mb={2}>
						Оставьте заявку и мы с вами свяжемся для покупки вашего автомобиля{' '}
					</Typography>
					{!isTablet && <SocialButtons />}
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
			<Articles articles={articles} />
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
	async (ctx: any, deviceType: 'desktop' | 'mobile') => ({
		articles: (
			await fetchArticles({
				populate: ['mainImage'],
				sort: ['createdAt:desc'],
				pagination: { limit: deviceType === 'mobile' ? 5 : 8 }
			})
		).data.data
	}),
	async () => ({
		carsOnParts: (await fetchCarsOnParts({ populate: ['images', 'volume', 'brand', 'model', 'generation'] })).data
			.data
	}),
	() => ({ hasGlobalContainer: false, hideSEOBox: true })
);
