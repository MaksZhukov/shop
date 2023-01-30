import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { ApiResponse, Filters, LinkWithImage, SEO } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { useState, SetStateAction, Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { getPageProps } from 'services/PagePropsService';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { fetchPage } from 'api/pages';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { fetchGenerations } from 'api/generations/generations';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { Brand } from 'api/brands/types';
import { fetchModels } from 'api/models/models';
import { DefaultPage, PageMain } from 'api/pages/types';
import { fetchCabins } from 'api/cabins/cabins';
import { fetchBrandBySlug, fetchBrands } from 'api/brands/brands';

interface Props {
	page: DefaultPage;
	cars: Car[];
	brands: ApiResponse<Brand[]>;
	articles: Article[];
	advertising: LinkWithImage[];
	autocomises: Autocomis[];
	deliveryAuto: LinkWithImage;
	discounts: LinkWithImage[];
	serviceStations: ServiceStation[];
}

const Cabins: NextPage<Props> = ({
	page,
	advertising,
	autocomises,
	deliveryAuto,
	discounts,
	serviceStations,
	cars,
	brands,
	articles,
}) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
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

	const handleOpenAutocompleteModel = (values: any) =>
		handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
			fetchModels({
				filters: { brand: { slug: values.brand } },
				pagination: { limit: MAX_LIMIT },
			})
		);

	const handleOpenAutocompleteGeneration = (values: { [key: string]: string | null }) =>
		handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
			fetchGenerations({
				filters: { model: { name: values.model as string } },
				pagination: { limit: MAX_LIMIT },
			})
		);

	const handleOpenAutocompleteKindSparePart = () =>
		handleOpenAutocomplete<KindSparePart>(!!kindSpareParts.length, setKindSpareParts, () =>
			fetchKindSpareParts({
				filters: { type: 'cabin' },
				pagination: { limit: MAX_LIMIT },
			})
		);

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const filtersConfig = [
		[
			{
				id: 'brand',
				placeholder: 'Марка',
				type: 'autocomplete',
				options: brands.data.map((item) => ({ label: item.name, value: item.slug })),
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
				onOpen: handleOpenAutocompleteModel,
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'generation',
				placeholder: 'Поколение',
				type: 'autocomplete',
				disabledDependencyId: 'model',
				options: generations.map((item) => item.name),
				onOpen: handleOpenAutocompleteGeneration,
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'kindSparePart',
				placeholder: 'Запчасть',
				type: 'autocomplete',
				options: kindSpareParts.map((item) => item.name),
				onOpen: handleOpenAutocompleteKindSparePart,
				noOptionsText: noOptionsText,
			},
		],
	];

	const generateFiltersByQuery = ({
		brand,
		model,
		generation,
		kindSparePart,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			brand: { slug: brand },
			model: { name: model },
			generation: { name: generation },
			kindSparePart: { name: kindSparePart },
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			newProductsTitle='Салонов'
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
					id: 'kindSparePart',
					name: 'Запчасть',
				},
			]}
			searchPlaceholder='Поиск детали ...'
			filtersConfig={filtersConfig}
			seo={page.seo}
			fetchData={fetchCabins}
			generateFiltersByQuery={generateFiltersByQuery}
		></Catalog>
	);
};

export default Cabins;

export const getServerSideProps = getPageProps(
	undefined,
	async (context) => {
		const { brand } = context.query;
		const brandParam = brand ? brand[0] : undefined;
		let seo: SEO | null = null;
		if (brandParam) {
			const {
				data: { data },
			} = await fetchBrandBySlug(brandParam, { populate: ['seoCabins.images', 'image'] });
			seo = data.seoCabins;
		} else {
			const {
				data: { data },
			} = await fetchPage('cabin')();
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
	}),
	async () => ({
		brands: (
			await fetchBrands({
				populate: ['image', 'seo.image'],
			})
		).data,
	})
);
