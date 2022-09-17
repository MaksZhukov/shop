import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import Catalog from 'components/Catalog';
import { CircularProgress, Container } from '@mui/material';
import { arrayOfYears } from 'components/Filters/config';
import {
	BODY_STYLES,
	FUELS,
	TRANSMISSIONS,
} from 'components/Filters/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { ApiResponse, Filters } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchBrands } from 'api/brands/brands';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import Head from 'next/head';
import News from 'components/News';

const Home: NextPage = () => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const {
		brandId = '',
		yearFrom = '',
		yearTo = '',
	} = router.query as {
		yearTo: string;
		yearFrom: string;
		brandId: string;
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
				const {
					data: { data },
				} = await fetchFunc();
				setState(data);
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
		router.push({ pathname: router.pathname, query: router.query });
		setModels([]);
	};

	const noOptionsText = isLoading ? (
		<CircularProgress size={20} />
	) : (
		<>Совпадений нет</>
	);

	const arrayOfYearsFrom = yearTo
		? arrayOfYears.filter((value) => +value <= +yearTo)
		: arrayOfYears;
	const arrayOfYearsTo = yearFrom
		? arrayOfYears.filter((value) => +value >= +yearFrom)
		: arrayOfYears;

	const filtersConfig = [
		[
			{
				id: 'min',
				disabled: false,
				placeholder: 'Цена от руб',
				type: 'number',
			},
			{
				id: 'max',
				disabled: false,
				placeholder: 'Цена до руб',
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
				disabled: true,
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
				id: 'yearFrom',
				placeholder: 'Год от',
				type: 'autocomplete',
				disabled: false,
				options: arrayOfYearsFrom,
				onOpen: () => {},
				noOptionsText: '',
			},
			{
				id: 'yearTo',
				placeholder: 'Год до',
				type: 'autocomplete',
				disabled: false,
				options: arrayOfYearsTo,
				onOpen: () => {},
				noOptionsText: '',
			},
		],
		[
			{
				id: 'kindSparePartId',
				name: 'kindSparePartName',
				placeholder: 'Запчасть',
				type: 'autocomplete',
				disabled: false,
				options: kindSpareParts.map((item) => ({
					label: item.name,
					...item,
				})),
				onOpen: handleOpenAutocomplete<KindSparePart>(
					!!kindSpareParts.length,
					setKindSpareParts,
					() =>
						fetchKindSpareParts({
							pagination: { limit: MAX_LIMIT },
						})
				),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'volume',
				placeholder: 'Обьем 2.0',
				type: 'number',
				disabled: false,
			},
		],
		[
			{
				id: 'bodyStyle',
				placeholder: 'Кузов',
				type: 'autocomplete',
				disabled: false,
				options: BODY_STYLES,
				onOpen: () => {},
				noOptionsText: '',
			},
		],
		[
			{
				id: 'transmission',
				placeholder: 'Коробка',
				type: 'autocomplete',
				disabled: false,
				options: TRANSMISSIONS,
				onOpen: () => {},
				noOptionsText: '',
			},
		],
		[
			{
				id: 'fuel',
				placeholder: 'Тип топлива',
				type: 'autocomplete',
				disabled: false,
				options: FUELS,
				onOpen: () => {},
				noOptionsText: '',
			},
		],
	];

	const generateFiltersByQuery = ({
		min,
		max,
		yearFrom,
		yearTo,
		brandId,
		modelId,
		sparePartId,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			price: { $gte: min || 0, $lte: max || undefined },
			year: {
				$gte: yearFrom || undefined,
				$lte: yearTo || undefined,
			},
			brand: brandId || undefined,
			model: modelId || undefined,
			sparePart: sparePartId || undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<>
			<Head>
				<title>Запчасти</title>
			</Head>
			<Container>
				<Catalog
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
					filtersConfig={filtersConfig}
					title='запчасти'
					fetchData={fetchSpareParts}
					generateFiltersByQuery={generateFiltersByQuery}></Catalog>
			</Container>
		</>
	);
};

export default Home;
