import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress, Container } from '@mui/material';
import { SEASONS } from 'components/Filters/constants';
import { ApiResponse, Filters } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, SetStateAction, Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import { Brand } from 'api/brands/types';
import { fetchBrands } from 'api/brands/brands';
import { fetchTires } from 'api/tires/tires';

const Tires: NextPage = () => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleOpenAutocomplete =
		<T extends any>(
			hasData: boolean,
			setState: Dispatch<SetStateAction<T[]>>,
			fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
		) =>
		async () => {
			if (!hasData) {
				setIsLoading(true);
				const {
					data: { data },
				} = await fetchFunc();
				setState(data);
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
				id: 'min',
				disabled: false,
				placeholder: 'Цена от',
				type: 'number',
			},
			{
				id: 'max',
				disabled: false,
				placeholder: 'Цена до',
				type: 'number',
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
		min,
		max,
		brandId,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			price: { $gte: min || 0, $lte: max || undefined },
			brand: brandId || undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<>
			<Head>
				<title>Шины</title>
				<meta name='description' content='Шины'></meta>
			</Head>
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
							id: 'height',
							name: 'Высота',
						},
					]}
					filtersConfig={filtersConfig}
					title='шины'
					fetchData={fetchTires}
					generateFiltersByQuery={generateFiltersByQuery}></Catalog>
			</Container>
		</>
	);
};

export default Tires;
