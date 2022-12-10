import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { ApiResponse, Filters, LinkWithImage } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getPageProps } from 'services/PagePropsService';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { useDebounce } from 'rooks';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';
import { fetchBrandByName, fetchBrands } from 'api/brands/brands';

interface Props {
	page: DefaultPage;
	brands: Brand[];
	cars: Car[];
	articles: Article[];
	advertising: LinkWithImage[];
	autocomises: Autocomis[];
	deliveryAuto: LinkWithImage;
	discounts: LinkWithImage[];
	serviceStations: ServiceStation[];
}

const SpareParts: NextPage<Props> = ({
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
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		const {
			data: { data },
		} = await fetchKindSpareParts({ filters: { name: { $contains: value } } });
		setKindSpareParts(data);
	});

	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

	const { brand = [], model = '' } = router.query as {
		brand: [string];
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

	const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
		fetchModels({
			filters: { brand: { name: brand[0] } },
			pagination: { limit: MAX_LIMIT },
		})
	);

	const handleOpenAutocompleteGeneration = handleOpenAutocomplete<Generation>(
		!!generations.length,
		setGenerations,
		() =>
			fetchGenerations({
				filters: { model: { name: model } },
				pagination: { limit: MAX_LIMIT },
			})
	);

	const handleOpenAutocompleteKindSparePart = handleOpenAutocomplete<KindSparePart>(
		!!kindSpareParts.length,
		setKindSpareParts,
		() =>
			fetchKindSpareParts({
				filters: {
					type: 'regular',
				},
				pagination: { limit: MAX_LIMIT },
			})
	);

	const hangleInputChangeKindSparePart = (_: any, value: string) => {
		debouncedFetchKindSparePartsRef(value);
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const filtersConfig = getSparePartsFiltersConfig({
		brands,
		models,
		kindSpareParts,
		generations,
		noOptionsText,
		onOpenAutocompleteModel: handleOpenAutocompleteModel,
		onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
		onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
		onInputChangeKindSparePart: hangleInputChangeKindSparePart,
	});

	const handleClickFind = (values: { [key: string]: string }) => {
		let shallow =
			(values.brand && router.query.brand && values.brand === router.query.brand[0]) ||
			(!values.brand && !router.query.brand)
				? true
				: false;

		Object.keys(values).forEach((key) => {
			if (!values[key]) {
				delete router.query[key];
			} else {
				router.query[key] = key === 'brand' ? [values[key]] : values[key];
			}
		});
		// It needs to avoid the same seo data for the page
		setTimeout(() => {
			router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow });
		}, 100);
	};

	const generateFiltersByQuery = ({
		brand,
		model,
		generation,
		kindSparePart,
		brandName,
		modelName,
		generationName,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			brand: brand ? { name: brand } : undefined,
			model: model ? { name: model } : undefined,
			generation: generation ? { name: generation } : undefined,
			kindSparePart: kindSparePart ? { name: kindSparePart } : undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			newProductsTitle='Запчасти'
			advertising={advertising}
			autocomises={autocomises}
			deliveryAuto={deliveryAuto}
			discounts={discounts}
			serviceStations={serviceStations}
			cars={cars}
			articles={articles}
			onClickFind={handleClickFind}
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
			seo={page?.seo}
			fetchData={fetchSpareParts}
			generateFiltersByQuery={generateFiltersByQuery}
		></Catalog>
	);
};

export default SpareParts;

export const getServerSideProps = getPageProps(
	undefined,
	async (context) => {
		const { brand } = context.query;
		const brandParam = brand ? brand[0] : undefined;
		const {
			data: { data },
		} = brandParam ? await fetchBrandByName(brand) : await fetchPage('spare-part')();
		return {
			page: { seo: data.seo },
		};
	},
	async () => ({
		autocomises: (await fetchAutocomises({ populate: 'image' })).data.data,
	}),
	async () => ({
		serviceStations: (await fetchServiceStations({ populate: 'image' })).data.data,
	}),
	async () => {
		const {
			data: {
				data: { advertising, deliveryAuto, discounts },
			},
		} = await fetchPage<PageMain>('main')();
		return {
			advertising,
			deliveryAuto,
			discounts,
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
				pagination: { limit: MAX_LIMIT },
			})
		).data.data,
	})
);
