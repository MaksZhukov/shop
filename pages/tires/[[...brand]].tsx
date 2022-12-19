import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { SEASONS } from 'components/Filters/constants';
import { ApiResponse, Filters, LinkWithImage, SEO } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { useState, SetStateAction, Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import { fetchTires } from 'api/tires/tires';
import { useSnackbar } from 'notistack';
import { fetchTireBrandBySlug, fetchTireBrands } from 'api/tireBrands/tireBrands';
import { getPageProps } from 'services/PagePropsService';
import { TireBrand } from 'api/tireBrands/types';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
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

const Tires: NextPage<Props> = ({
	page,
	advertising,
	autocomises,
	deliveryAuto,
	discounts,
	serviceStations,
	cars,
	articles,
}) => {
	const [brands, setBrands] = useState<TireBrand[]>([]);
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
				id: 'brand',
				placeholder: 'Марка',
				type: 'autocomplete',
				options: brands.map((item) => ({ label: item.name, value: item.slug })),
				onOpen: handleOpenAutocomplete<TireBrand>(
					!!brands.length,
					setBrands,

					() =>
						fetchTireBrands({
							pagination: { limit: MAX_LIMIT },
						})
				),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'width',
				placeholder: 'Ширина',
				type: 'number',
			},
			{
				id: 'height',
				placeholder: 'Высота',
				type: 'number',
			},
		],
		[
			{
				id: 'diameter',
				placeholder: 'Диаметр',
				type: 'number',
			},
		],
		[
			{
				id: 'season',
				placeholder: 'Сезон',
				type: 'autocomplete',
				options: SEASONS,
				noOptionsText: '',
			},
		],
	];

	const generateFiltersByQuery = ({ brand, ...others }: { [key: string]: string }): Filters => {
		let filters: Filters = {
			brand: brand ? { slug: brand } : undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			seo={page.seo}
			newProductsTitle='Шин'
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
					id: 'diameter',
					name: 'Диаметр',
				},
				{
					id: 'width',
					name: 'Ширина',
				},
				{
					id: 'count',
					name: 'Количество',
				},
			]}
			searchPlaceholder='Поиск шин ...'
			filtersConfig={filtersConfig}
			fetchData={fetchTires}
			generateFiltersByQuery={generateFiltersByQuery}
		></Catalog>
	);
};

export default Tires;

export const getServerSideProps = getPageProps(
	undefined,
	async (context) => {
		const { brand } = context.query;
		const brandParam = brand ? brand[0] : undefined;
		let seo: SEO | null = null;
		if (brandParam) {
			const {
				data: { data },
			} = await fetchTireBrandBySlug(brandParam, { populate: ['seo.images', 'image'] });
			seo = data.seo;
		} else {
			const {
				data: { data },
			} = await fetchPage('tire')();
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
