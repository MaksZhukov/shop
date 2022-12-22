import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { ApiResponse, Filters, LinkWithImage, SEO } from 'api/types';
import { fetchWheels } from 'api/wheels/wheels';
import { fetchBrandBySlug, fetchBrands } from 'api/brands/brands';
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
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { Article } from 'api/articles/types';
import { fetchArticles } from 'api/articles/articles';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';
import { WheelWidth } from 'api/wheelWidths/types';
import { WheelDiskOffset } from 'api/wheelDiskOffsets/types';
import { WheelNumberHole } from 'api/wheelNumberHoles/types';
import { WheelDiameterCenterHole } from 'api/wheelDiameterCenterHoles/types';
import { WheelDiameter } from 'api/wheelDiameters/types';
import { WheelDistanceBetweenCenter } from 'api/wheelDistanceBetweenCenters/types';
import { fetchWheelWidths } from 'api/wheelWidths/wheelWidths';
import { fetchWheelDiameters } from 'api/wheelDiameters/wheelDiameters';
import { fetchWheelNumberHoles } from 'api/wheelNumberHoles/wheelNumberHoles';
import { fetchWheelDiameterCenterHoles } from 'api/wheelDiameterCenterHoles/wheelDiameterCenterHoles';
import { fetchWheelDistanceBetweenCenters } from 'api/wheelDistanceBetweenCenters/wheelDistanceBetweenCenters';
import { fetchWheelDiskOffsets } from 'api/wheelDiskOffsets/wheelWidths';
import { getParamByRelation } from 'services/ParamsService';

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
	const [widths, setWidths] = useState<WheelWidth[]>([]);
	const [diskOffsets, setDiskOffsets] = useState<WheelDiskOffset[]>([]);
	const [numberHoles, setNumberHoles] = useState<WheelNumberHole[]>([]);
	const [diameterCenterHoles, setDiameterCenterHoles] = useState<WheelDiameterCenterHole[]>([]);
	const [diameters, setDiameters] = useState<WheelDiameter[]>([]);
	const [distanceBetweenCenters, setDistanceBetweenCenters] = useState<WheelDistanceBetweenCenter[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
				options: brands.map((item) => ({ label: item.name, value: item.slug })),
				onOpen: () =>
					handleOpenAutocomplete<Brand>(!!brands.length, setBrands, () =>
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
				onOpen: (values: any) =>
					handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
						fetchModels({
							filters: { brand: { slug: values.brand } },
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
				type: 'autocomplete',
				options: widths.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<WheelWidth>(!!widths.length, setWidths, () =>
						fetchWheelWidths({
							pagination: { limit: MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'diameter',
				placeholder: 'R диаметр, дюйм',
				type: 'autocomplete',
				options: diameters.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<WheelDiameter>(!!diameters.length, setDiameters, () =>
						fetchWheelDiameters({
							pagination: { limit: MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'numberHoles',
				placeholder: 'Количество отверстий',
				type: 'autocomplete',
				options: numberHoles.map((item) => item.name),
				onOpen: (values: any) =>
					handleOpenAutocomplete<WheelNumberHole>(!!numberHoles.length, setNumberHoles, () =>
						fetchWheelNumberHoles({
							pagination: { limit: MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'diameterCenterHole',
				placeholder: 'DIA диаметр центрального отверстия, мм',
				type: 'autocomplete',
				options: diameterCenterHoles.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<WheelDiameterCenterHole>(
						!!diameterCenterHoles.length,
						setDiameterCenterHoles,
						() =>
							fetchWheelDiameterCenterHoles({
								pagination: { limit: MAX_LIMIT },
							})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'distanceBetweenCenters',
				placeholder: 'ET вылет, мм',
				type: 'autocomplete',
				options: distanceBetweenCenters.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<WheelDistanceBetweenCenter>(
						!!distanceBetweenCenters.length,
						setDistanceBetweenCenters,
						() =>
							fetchWheelDistanceBetweenCenters({
								pagination: { limit: MAX_LIMIT },
							})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'diskOffset',
				placeholder: 'PCD расстояние между отверстиями, мм',
				type: 'autocomplete',
				options: diskOffsets.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<WheelDiskOffset>(!!diskOffsets.length, setDiskOffsets, () =>
						fetchWheelDiskOffsets({
							pagination: { limit: MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
	];

	const generateFiltersByQuery = ({
		brand,
		model,
		diskOffset,
		distanceBetweenCenters,
		diameterCenterHole,
		numberHoles,
		diameter,
		width,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			brand: getParamByRelation(brand, 'slug'),
			model: getParamByRelation(model),
			diskOffset: getParamByRelation(diskOffset),
			distanceBetweenCenters: getParamByRelation(distanceBetweenCenters),
			diameterCenterHole: getParamByRelation(diameterCenterHole),
			numberHoles: getParamByRelation(numberHoles),
			diameter: getParamByRelation(diameter),
			width: getParamByRelation(width),
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			seo={page.seo}
			newProductsTitle='Дисков'
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
			} = await fetchBrandBySlug(brandParam, { populate: ['seoWheels.images', 'image'] });
			seo = data.seoWheels;
		} else {
			const {
				data: { data },
			} = await fetchPage('wheel')();
			seo = data.seo;
		}
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
