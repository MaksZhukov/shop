import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress, Container } from '@mui/material';
import { SEASONS } from 'components/Filters/constants';
import { ApiResponse, Filters, LinkWithImage } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { useState, SetStateAction, Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import { fetchTires } from 'api/tires/tires';
import { useSnackbar } from 'notistack';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import { getPageProps } from 'services/PagePropsService';
import { fetchPageTires } from 'api/pageTires/pageTires';
import { PageTires } from 'api/pageTires/types';
import { TireBrand } from 'api/tireBrands/types';
import { fetchCars } from 'api/cars/cars';
import { fetchPageMain } from 'api/pageMain/pageMain';
import { fetchNews } from 'api/news/news';
import { OneNews } from 'api/news/types';
import { Car } from 'api/cars/types';

interface Props {
	data: PageTires;
	cars: Car[];
	news: OneNews[];
	advertising: LinkWithImage[];
	autocomises: LinkWithImage[];
	deliveryAuto: LinkWithImage;
	discounts: LinkWithImage[];
	serviceStations: LinkWithImage[];
}

const Tires: NextPage<Props> = ({
	data,
	advertising,
	autocomises,
	deliveryAuto,
	discounts,
	serviceStations,
	cars,
	news,
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

	const noOptionsText = isLoading ? (
		<CircularProgress size={20} />
	) : (
		<>Совпадений нет</>
	);

	const filtersConfig = [
		[
			{
				id: 'brandId',
				name: 'brandName',
				placeholder: 'Марка',
				disabled: false,
				type: 'autocomplete',
				options: brands.map((item) => ({ label: item.name, ...item })),
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
				disabled: false,
				placeholder: 'Ширина',
				type: 'number',
			},
			{
				id: 'height',
				disabled: false,
				placeholder: 'Высота',
				type: 'number',
			},
		],
		[
			{
				id: 'diameter',
				placeholder: 'Диаметр',
				type: 'number',
				disabled: false,
			},
		],
		[
			{
				id: 'season',
				placeholder: 'Сезон',
				type: 'autocomplete',
				disabled: false,
				options: SEASONS,
				noOptionsText: '',
			},
		],
	];

	const generateFiltersByQuery = ({
		brandId,
		brandName,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			brand: brandId || undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			seo={data.seo}
			newProductsTitle='Шины'
			advertising={advertising}
			autocomises={autocomises}
			deliveryAuto={deliveryAuto}
			discounts={discounts}
			serviceStations={serviceStations}
			cars={cars}
			news={news}
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
			generateFiltersByQuery={generateFiltersByQuery}></Catalog>
	);
};

export default Tires;

export const getStaticProps = getPageProps(
	fetchPageTires,
	async () => {
		const {
			data: {
				data: {
					advertising,
					autocomises,
					deliveryAuto,
					discounts,
					serviceStations,
				},
			},
		} = await fetchPageMain();
		return {
			advertising,
			autocomises,
			deliveryAuto,
			discounts,
			serviceStations,
		};
	},
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
	}
);
