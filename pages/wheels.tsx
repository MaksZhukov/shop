import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress, Container } from '@mui/material';
import { ApiResponse, Filters, LinkWithImage } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { fetchBrands } from 'api/brands/brands';
import { fetchModels } from 'api/models/models';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { MAX_LIMIT } from 'api/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { useSnackbar } from 'notistack';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { getPageProps } from 'services/PagePropsService';
import { fetchPageWheels } from 'api/pageWheels/pageWheels';
import { PageWheels } from 'api/pageWheels/types';
import { Car } from 'api/cars/types';
import { OneNews } from 'api/news/types';
import { fetchPageMain } from 'api/pageMain/pageMain';
import { fetchCars } from 'api/cars/cars';
import { fetchNews } from 'api/news/news';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { Article } from 'api/articles/types';
import { fetchArticles } from 'api/articles/articles';

interface Props {
	data: PageWheels;
	cars: Car[];
	articles: Article[];
	advertising: LinkWithImage[];
	autocomises: Autocomis[];
	deliveryAuto: LinkWithImage;
	discounts: LinkWithImage[];
	serviceStations: ServiceStation[];
}

const Wheels: NextPage<Props> = ({
	data,
	advertising,
	autocomises,
	deliveryAuto,
	discounts,
	serviceStations,
	cars,
	articles,
}) => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const { brandId = '', modelId = '' } = router.query as {
		brandId: string;
		modelId: string;
	};

	const { enqueueSnackbar } = useSnackbar();

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

	const filtersConfig = [
		[
			{
				id: 'kind',
				placeholder: 'Тип диска',
				disabled: false,
				type: 'autocomplete',
				options: ['литой', 'штампованный'],
			},
		],
		[
			{
				id: 'brandId',
				name: 'brandName',
				placeholder: 'Марка',
				disabled: false,
				type: 'autocomplete',
				options: brands.map((item) => ({ label: item.name, ...item })),
				onOpen: handleOpenAutocomplete<Brand>(
					!!brands.length,
					setBrands,
					() =>
						fetchBrands({
							pagination: { limit: MAX_LIMIT },
						})
				),
				onChange: handleChangeBrandAutocomplete,
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
				onOpen: handleOpenAutocomplete<Model>(
					!!models.length,
					setModels,
					() =>
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
				id: 'width',
				placeholder: 'J ширина, мм',
				disabled: false,
				type: 'number',
			},
		],
		[
			{
				id: 'diameter',
				placeholder: 'R диаметр, дюйм',
				disabled: false,
				type: 'number',
			},
		],
		[
			{
				id: 'numberHoles',
				placeholder: 'Количество отверстий',
				disabled: false,
				type: 'number',
			},
		],
		[
			{
				id: 'diameterCenterHole',
				placeholder: 'DIA диаметр центрального отверстия, мм',
				disabled: false,
				type: 'number',
			},
		],
		[
			{
				id: 'distanceBetweenCenters',
				placeholder: 'PCD расстояние между отверстиями, мм',
				disabled: false,
				type: 'number',
			},
		],
		[
			{
				id: 'diskOffset',
				placeholder: 'ET вылет, мм',
				disabled: false,
				type: 'number',
			},
		],
	];

	const generateFiltersByQuery = ({
		min,
		max,
		brandName,
		modelName,
		modelId,
		brandId,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			brand: brandId || undefined,
			model: modelId || undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			seo={data.seo}
			newProductsTitle='Диски'
			advertising={advertising}
			autocomises={autocomises}
			deliveryAuto={deliveryAuto}
			discounts={discounts}
			serviceStations={serviceStations}
			cars={cars}
			articles={articles}
			dataFieldsToShow={[
				{
					id: 'brand',
					name: 'Марка',
				},
				{
					id: 'model',
					name: 'Модель',
				},
				{
					id: 'diameter',
					name: 'R диаметр',
				},
				{
					id: 'count',
					name: 'Количество',
				},
			]}
			searchPlaceholder='Поиск дисков ...'
			filtersConfig={filtersConfig}
			fetchData={fetchWheels}
			generateFiltersByQuery={generateFiltersByQuery}></Catalog>
	);
};

export default Wheels;

export const getServerSideProps = getPageProps(
	fetchPageWheels,
	async () => ({
		autocomises: (await fetchAutocomises({ populate: 'image' }, true)).data
			.data,
	}),
	async () => ({
		serviceStations: (
			await fetchServiceStations({ populate: 'image' }, true)
		).data.data,
	}),
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
	async () => {
		const { data } = await fetchCars(
			{ populate: ['images'], pagination: { limit: 10 } },
			true
		);
		return { cars: data.data };
	},
	async () => ({
		articles: (await fetchArticles({ populate: 'image' }, true)).data.data,
	})
);
