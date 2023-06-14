import { CircularProgress } from '@mui/material';
import { API_MAX_LIMIT } from 'api/constants';
import { DefaultPage } from 'api/pages/types';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import { TireBrand } from 'api/tireBrands/types';
import { fetchTireDiameters } from 'api/tireDiameters/tireDiameters';
import { TireDiameter } from 'api/tireDiameters/types';
import { fetchTireHeights } from 'api/tireHeights/tireHeights';
import { TireHeight } from 'api/tireHeights/types';
import { fetchTireWidths } from 'api/tireWidths/tireWidths';
import { TireWidth } from 'api/tireWidths/types';
import { fetchTires } from 'api/tires/tires';
import { ApiResponse, Filters } from 'api/types';
import { AxiosResponse } from 'axios';
import Catalog from 'components/Catalog';
import { SEASONS_SLUGIFY, SLUGIFY_SEASONS } from 'config';
import { useSnackbar } from 'notistack';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { getParamByRelation } from 'services/ParamsService';
import { SEASONS } from '../../constants';

interface Props {
	page: DefaultPage;
	tireBrands: TireBrand[];
}

const CatalogTires: FC<Props> = ({ page, tireBrands }) => {
	const [brands, setBrands] = useState<TireBrand[]>(tireBrands);
	const [widths, setWidths] = useState<TireWidth[]>([]);
	const [heights, setHeights] = useState<TireHeight[]>([]);
	const [diameters, setDiameters] = useState<TireDiameter[]>([]);
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

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const filtersConfig = [
		[
			{
				id: 'brand',
				placeholder: 'Марка',
				type: 'autocomplete',
				options: brands.map((item) => ({ label: item.name, value: item.slug })),
				onOpen: () =>
					handleOpenAutocomplete<TireBrand>(
						!!brands.length,
						setBrands,

						() =>
							fetchTireBrands({
								pagination: { limit: API_MAX_LIMIT }
							})
					),
				noOptionsText: noOptionsText
			}
		],
		[
			{
				id: 'width',
				placeholder: 'Ширина',
				type: 'autocomplete',
				options: widths.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<TireWidth>(
						!!widths.length,
						setWidths,

						() =>
							fetchTireWidths({
								pagination: { limit: API_MAX_LIMIT }
							})
					),
				noOptionsText: noOptionsText
			}
		],
		[
			{
				id: 'height',
				placeholder: 'Высота',
				type: 'autocomplete',
				options: heights.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<TireHeight>(
						!!heights.length,
						setHeights,

						() =>
							fetchTireHeights({
								pagination: { limit: API_MAX_LIMIT }
							})
					),
				noOptionsText: noOptionsText
			}
		],
		[
			{
				id: 'diameter',
				placeholder: 'Диаметр',
				type: 'autocomplete',
				options: diameters.map((item) => item.name),
				onOpen: () =>
					handleOpenAutocomplete<TireDiameter>(
						!!diameters.length,
						setDiameters,

						() =>
							fetchTireDiameters({
								pagination: { limit: API_MAX_LIMIT }
							})
					),
				noOptionsText: noOptionsText
			}
		],
		[
			{
				id: 'season',
				placeholder: 'Сезон',
				type: 'autocomplete',
				options: SEASONS.map((item) => ({ label: item, value: SEASONS_SLUGIFY[item] })),
				noOptionsText: ''
			}
		]
	];

	const generateFiltersByQuery = ({
		brand,
		diameter,
		height,
		width,
		season,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			brand: getParamByRelation(brand, 'slug'),
			width: getParamByRelation(width),
			height: getParamByRelation(height),
			diameter: getParamByRelation(diameter),
			season: SLUGIFY_SEASONS[season]
		};
		return { ...filters, ...others };
	};

	return (
		<Catalog
			brands={[]}
			seo={page.seo}
			dataFieldsToShow={[
				{
					id: 'brand',
					name: 'Марка'
				},
				{
					id: 'diameter',
					name: 'Диаметр'
				},
				{
					id: 'width',
					name: 'Ширина'
				},
				{
					id: 'count',
					name: 'Количество'
				}
			]}
			searchPlaceholder='Поиск ...'
			filtersConfig={filtersConfig}
			fetchData={fetchTires}
			generateFiltersByQuery={generateFiltersByQuery}
		></Catalog>
	);
};

export default CatalogTires;
