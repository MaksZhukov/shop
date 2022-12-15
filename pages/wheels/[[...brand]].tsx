import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { ApiResponse, Filters, LinkWithImage, SEO } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { fetchBrandByName, fetchBrands } from 'api/brands/brands';
import { fetchModels } from 'api/models/models';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { MAX_LIMIT } from 'api/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { useSnackbar } from 'notistack';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { getPageProps } from 'services/PagePropsService';
import { Car } from 'api/cars/types';
import { fetchCars } from 'api/cars/cars';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { Article } from 'api/articles/types';
import { fetchArticles } from 'api/articles/articles';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';

interface Props {
	page: DefaultPage;
	cars: Car[];
	articles: Article[];
	advertising: LinkWithImage[];
	autocomises: Autocomis[];
	deliveryAuto: LinkWithImage;
	discounts: LinkWithImage[];
	serviceStations: ServiceStation[];
}

const Wheels: NextPage<Props> = ({
	page,
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

	const { brand = '' } = router.query as {
		brand: string;
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

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const filtersConfig = [
		[
			{
				id: 'kind',
				placeholder: 'Тип диска',
				type: 'autocomplete',
				options: ['литой', 'штампованный'],
			},
		],
		[
			{
				id: 'brand',
				placeholder: 'Марка',
				type: 'autocomplete',
				options: brands.map((item) => item.name),
				onOpen: handleOpenAutocomplete<Brand>(!!brands.length, setBrands, () =>
					fetchBrands({
						pagination: { limit: MAX_LIMIT },
					})
				),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'model',
				placeholder: 'Модель',
				type: 'autocomplete',
				disabledDependencyId: 'brand',
				options: models.map((item) => item.name),
				onOpen: handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
					fetchModels({
						filters: { brand: { name: brand } },
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
				type: 'number',
			},
		],
		[
			{
				id: 'diameter',
				placeholder: 'R диаметр, дюйм',
				type: 'number',
			},
		],
		[
			{
				id: 'numberHoles',
				placeholder: 'Количество отверстий',
				type: 'number',
			},
		],
		[
			{
				id: 'diameterCenterHole',
				placeholder: 'DIA диаметр центрального отверстия, мм',
				type: 'number',
			},
		],
		[
			{
				id: 'distanceBetweenCenters',
				placeholder: 'PCD расстояние между отверстиями, мм',
				type: 'number',
			},
		],
		[
			{
				id: 'diskOffset',
				placeholder: 'ET вылет, мм',
				type: 'number',
			},
		],
	];

	const generateFiltersByQuery = ({ brand, model, ...others }: { [key: string]: string }): Filters => {
		let filters: Filters = {
			brand: brand ? { name: brand } : undefined,
			model: model ? { name: model } : undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			seo={page.seo}
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
			generateFiltersByQuery={generateFiltersByQuery}
		></Catalog>
	);
};

export default Wheels;

export const getServerSideProps = getPageProps(
	undefined,
	async (context) => {
		const { brand } = context.query;
		const brandParam = brand ? brand[0] : undefined;
		let seo: SEO | null = null;
		if (brandParam) {
			const {
				data: { data },
			} = await fetchBrandByName(brand, { populate: ['seoWheels.images', 'image'] });
			seo = data.seoWheels;
		} else {
			const {
				data: { data },
			} = await fetchPage('wheel')();
			seo = data.seo;
		}
		console.log(seo);
		return {
			page: { seo },
		};
	},
	async () => {
		const {
			data: {
				data: { advertising, deliveryAuto, discounts, autocomises, serviceStations },
			},
		} = await fetchPage<PageMain>('main')();
		return {
			advertising,
			deliveryAuto,
			discounts,
			autocomises,
			serviceStations,
		};
	},
	async () => {
		const { data } = await fetchCars({ populate: ['images'], pagination: { limit: 10 } });
		return { cars: data.data };
	},
	async () => ({
		articles: (await fetchArticles({ populate: 'image' })).data.data,
	})
);
