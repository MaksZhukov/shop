import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import Catalog from 'components/Catalog';
import { CircularProgress, Container } from '@mui/material';
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
import { useStore } from 'store';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getStaticSeoProps } from 'services/StaticPropsService';
import { fetchPageSpareParts } from 'api/pageSpareParts/pageSpareParts';
import { PageSpareParts } from 'api/pageSpareParts/types';
import HeadSEO from 'components/HeadSEO';

interface Props {
	data: PageSpareParts;
}

const Home: NextPage<Props> = ({ data }) => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const { brandId = '', modelId = '' } = router.query as {
		brandId: string;
		modelId: string;
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

	const handleChangeBrandAutocomplete = (_: any, selected: Brand | null) => {
		if (selected) {
			router.query.brandName = selected.name.toString();
			router.query.brandId = selected.id.toString();
		} else {
			delete router.query.brandName;
			delete router.query.brandId;
			delete router.query.modelName;
			delete router.query.modelId;
			delete router.query.generationId;
			delete router.query.generationName;
		}
		router.push({ pathname: router.pathname, query: router.query });
		setModels([]);
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
				disabled: !brandId,
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
				id: 'generationId',
				name: 'generationName',
				placeholder: 'Поколение',
				type: 'autocomplete',
				disabled: !modelId,
				options: generations.map((item) => ({
					label: item.name,
					...item,
				})),
				onOpen: handleOpenAutocomplete<Generation>(
					!!generations.length,
					setGenerations,
					() =>
						fetchGenerations({
							filters: { model: modelId as string },
							pagination: { limit: MAX_LIMIT },
						})
				),
				noOptionsText: noOptionsText,
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
		brandId,
		modelId,
		generationId,
		sparePartId,
		brandName,
		modelName,
		generationName,
		sparePartName,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			brand: brandId || undefined,
			model: modelId || undefined,
			generation: generationId || undefined,
			sparePart: sparePartId || undefined,
		};
		return { ...filters, ...others };
	};

	return (
		<>
			<HeadSEO
				title={data.seo?.title || 'Запчасти'}
				description={data.seo?.description || 'Запчасти от автомобилей'}
				keywords={
					data.seo?.keywords ||
					'запчасти, запчасти от авто, запчасти на продажу, купить запчасти'
				}></HeadSEO>
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
					title={data.seo?.h1 || 'запчасти'}
					fetchData={fetchSpareParts}
					generateFiltersByQuery={generateFiltersByQuery}></Catalog>
			</Container>
		</>
	);
};

export default Home;

export const getStaticProps = getStaticSeoProps(fetchPageSpareParts);
