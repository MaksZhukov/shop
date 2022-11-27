import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress, Container } from '@mui/material';
import { SEASONS } from 'components/Filters/constants';
import { ApiResponse, Filters } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { useState, SetStateAction, Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import { fetchTires } from 'api/tires/tires';
import { useSnackbar } from 'notistack';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import { getPageProps } from 'services/PagePropsService';
import { fetchPageTires } from 'api/pageTires/pageTires';
import { PageTires } from 'api/pageTires/types';
import HeadSEO from 'components/HeadSEO';
import SEOBox from 'components/SEOBox';
import { TireBrand } from 'api/tireBrands/types';

interface Props {
	data: PageTires;
}

const Tires: NextPage<Props> = ({ data }) => {
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
		<>
			<HeadSEO
				title={data.seo?.title || 'Шины'}
				description={data.seo?.description || 'Шины'}
				keywords={
					data.seo?.keywords ||
					'шины, шины для автомобилей, купить шины, колеса'
				}></HeadSEO>
			<Container>
				<Catalog
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
					title={data.seo?.h1 || 'шины'}
					fetchData={fetchTires}
					generateFiltersByQuery={generateFiltersByQuery}></Catalog>
				<SEOBox
					images={data.seo?.images}
					content={data.seo?.content}></SEOBox>
			</Container>
		</>
	);
};

export default Tires;

export const getStaticProps = getPageProps(fetchPageTires);
