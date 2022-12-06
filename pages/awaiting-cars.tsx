import { Alert, CircularProgress, Container, Pagination, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { Autocomis } from 'api/autocomises/types';
import { fetchBrands } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { PageAwaitingCars } from 'api/pageAwaitingCars/types';
import { fetchPageMain } from 'api/pageMain/pageMain';
import { fetchPage } from 'api/pages';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';
import { ServiceStation } from 'api/serviceStations/types';
import { ApiResponse, LinkWithImage } from 'api/types';
import { AxiosResponse } from 'axios';
import CarItem from 'components/CarItem';
import Catalog from 'components/Catalog';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from 'components/Filters/constants';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: PageAwaitingCars;
	articles: Article[];
	advertising: LinkWithImage[];
	autocomises: Autocomis[];
	deliveryAuto: LinkWithImage;
	serviceStations: ServiceStation[];
	discounts: LinkWithImage[];
	cars: ApiResponse<Car[]>;
	brands: Brand[];
}

const AwaitingCars: NextPage<Props> = ({
	page,
	articles,
	autocomises,
	advertising,
	deliveryAuto,
	discounts,
	brands,
	serviceStations,
	cars: pCars,
}) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [cars, setCars] = useState<Car[]>(pCars.data);
	const [pageCount, setPageCount] = useState<number>(pCars.meta.pagination?.pageCount ?? 0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

	const {
		brandId = '',
		modelId = '',
		generationId = '',
		fuel = '',
		bodyStyle = '',
		transmission = '',
		page: qPage = '1',
	} = router.query as {
		brandId: string;
		modelId: string;
		generationId: string;
		sparePartId: string;
		fuel: string;
		bodyStyle: string;
		transmission: string;
		sort: string;
		page: string;
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

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

	const filtersConfig = [
		[
			{
				id: 'brandId',
				name: 'brandName',
				placeholder: 'Марка',
				disabled: false,
				type: 'autocomplete',
				options: brands.map((item) => ({ label: item.name, ...item })),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'modelId',
				name: 'modelName',
				placeholder: 'Модель',
				type: 'autocomplete',
				disabled: !brandId,
				options: models.map((item) => ({ label: item.name, ...item })),
				onOpen: handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
					fetchModels({
						filters: { brand: brandId as string },
						pagination: { limit: MAX_LIMIT },
					})
				),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'generationId',
				name: 'generationName',
				placeholder: 'Поколение',
				type: 'autocomplete',
				disabled: !modelId,
				options: generations.map((item) => ({
					label: item.name,
					...item,
				})),
				onOpen: handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
					fetchGenerations({
						filters: { model: modelId as string },
						pagination: { limit: MAX_LIMIT },
					})
				),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'volume',
				placeholder: 'Обьем 2.0',
				type: 'number',
				disabled: false,
			},
		],
		[
			{
				id: 'bodyStyle',
				placeholder: 'Кузов',
				type: 'autocomplete',
				disabled: false,
				options: BODY_STYLES,
			},
		],
		[
			{
				id: 'transmission',
				placeholder: 'Коробка',
				type: 'autocomplete',
				disabled: false,
				options: TRANSMISSIONS,
			},
		],
		[
			{
				id: 'fuel',
				placeholder: 'Тип топлива',
				type: 'autocomplete',
				disabled: false,
				options: FUELS,
			},
		],
	];

	const handleChangePage = (_: any, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query }, undefined, {
			shallow: true,
		});
	};

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const {
				data: {
					data,
					meta: { pagination },
				},
			} = await fetchCars({
				filters: {
					brand: brandId || undefined,
					model: modelId || undefined,
					generation: generationId || undefined,
					transmission: transmission || undefined,
					fuel: fuel || undefined,
					bodyStyle: bodyStyle || undefined,
				},
				pagination: { page: +qPage },
				populate: ['images', 'model', 'brand'],
			});
			setCars(data);
			if (pagination) {
				setPageCount(pagination.pageCount);
				if (pagination.pageCount < +qPage) {
					router.query.page = (pagination.pageCount || 1).toString();
					router.push(
						{
							pathname: router.pathname,
							query: router.query,
						},
						undefined,
						{ shallow: true }
					);
				}
			}
			setIsFirstDataLoaded(true);
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с загрузкой автомобилей, обратитесь в поддержку', {
				variant: 'error',
			});
		}
		setIsLoading(false);
	};

	return (
		<Catalog
			filtersConfig={filtersConfig}
			articles={articles}
			autocomises={autocomises}
			seo={page.seo}
			advertising={advertising}
			deliveryAuto={deliveryAuto}
			discounts={discounts}
			serviceStations={serviceStations}
			onClickFind={fetchData}
			middleContent={
				<WhiteBox>
					{!!cars.length ? (
						cars.map((item) => <CarItem key={item.id} data={item}></CarItem>)
					) : isFirstDataLoaded && !isLoading ? (
						<Typography textAlign='center' variant='h5'>
							Данных не найдено
						</Typography>
					) : (
						<></>
					)}
					{pageCount > 1 && (
						<WhiteBox display='flex' justifyContent='center'>
							<Pagination
								page={+page}
								siblingCount={2}
								color='primary'
								count={pageCount}
								onChange={handleChangePage}
								variant='outlined'
							/>
						</WhiteBox>
					)}
				</WhiteBox>
			}
		></Catalog>
	);
};

export default AwaitingCars;

export const getStaticProps = getPageProps(
	fetchPage('awaiting-car'),
	async () => {
		const {
			data: {
				data: { advertising, deliveryAuto, discounts },
			},
		} = await fetchPageMain();
		return {
			advertising,
			deliveryAuto,
			discounts,
		};
	},
	async () => ({
		cars: (await fetchCars({ populate: ['images'], pagination: { limit: 10 } }, true)).data,
	}),
	async () => ({
		autocomises: (await fetchAutocomises({ populate: 'image' }, true)).data.data,
	}),
	async () => ({
		serviceStations: (await fetchServiceStations({ populate: 'image' }, true)).data.data,
	}),
	async () => ({
		articles: (await fetchArticles({ populate: 'image' }, true)).data.data,
	}),
	async () => ({
		brands: (
			await fetchBrands(
				{
					populate: 'image',
					pagination: { limit: MAX_LIMIT },
				},
				true
			)
		).data.data,
	})
);
