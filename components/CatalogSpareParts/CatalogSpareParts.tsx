import { CircularProgress } from '@mui/material';
import { BrandWithSparePartsCount } from 'api/brands/types';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'api/constants';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/engineVolumes';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModels } from 'api/models/models';
import { ModelSparePartsCountWithGenerationsSparePartsCount } from 'api/models/types';
import { DefaultPage } from 'api/pages/types';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { ApiResponse, Filters } from 'api/types';
import axios, { AxiosResponse } from 'axios';
import Catalog from 'components/Catalog';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { SLUGIFY_BODY_STYLES, SLUGIFY_FUELS, SLUGIFY_TRANSMISSIONS } from 'config';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, FC, SetStateAction, UIEventHandler, useEffect, useRef, useState } from 'react';
import { useDebounce, useThrottle } from 'rooks';
import { getParamByRelation } from 'services/ParamsService';
import { OFFSET_SCROLL_LOAD_MORE } from '../../constants';

interface Props {
	page: DefaultPage;
	brands: BrandWithSparePartsCount[];
	kindSparePart?: KindSparePart;
}

const CatalogSpareParts: FC<Props> = ({ page, brands = [], kindSparePart }) => {
	const [models, setModels] = useState<ModelSparePartsCountWithGenerationsSparePartsCount[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({
		data: kindSparePart ? [kindSparePart] : [],
		meta: {}
	});
	const [volumes, setVolumes] = useState<EngineVolume[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const abortControllerRef = useRef<AbortController | null>(null);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const [total, setTotal] = useState<number | null>(null);
	const [filtersValues, setFiltersValues] = useState<{ [key: string]: string | null }>({});
	const { enqueueSnackbar } = useSnackbar();

	const router = useRouter();
	const [brand, model] = router.query.slug || [];

	useEffect(() => {
		if (kindSparePart) {
			setKindSpareParts({
				data: [kindSparePart],
				meta: {}
			});
		}
	}, [kindSparePart]);

	useEffect(() => {
		if (router.query.generation) {
			handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
				fetchGenerations({
					filters: { model: { slug: model.replace('model-', '') as string }, brand: { slug: brand } },
					pagination: { limit: API_MAX_LIMIT }
				})
			)();
		}
	}, [router.query.generation]);

	const loadKindSpareParts = async () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;
		try {
			const { data } = await fetchKindSpareParts(
				{
					pagination: { start: kindSpareParts.data.length }
				},
				{ abortController: controller }
			);
			setKindSpareParts({
				data: [
					...kindSpareParts.data,
					...(kindSparePart ? data.data.filter((item) => item.id !== kindSparePart.id) : data.data)
				],
				meta: data.meta
			});
		} catch (err) {
			if (!axios.isCancel(err)) {
				enqueueSnackbar(
					'Произошла какая-то ошибка при загрузке данных для автозаполнения, попробуйте снова или обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		}
	};

	const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
		setIsLoadingMore(true);
		await loadKindSpareParts();
		setIsLoadingMore(false);
	});
	useEffect(() => {
		const fetch = async () => {
			const models = await fetchModels<ModelSparePartsCountWithGenerationsSparePartsCount>({
				filters: { brand: { slug: filtersValues.brand || brand } },
				pagination: { limit: API_MAX_LIMIT },
				populate: { generations: { populate: { spareParts: { count: true, filters: { sold: false } } } } }
			});
			setModels(models.data.data);
		};
		if (brand || filtersValues.brand) {
			fetch();
		}
	}, [brand, filtersValues.brand]);

	useEffect(() => {
		setFiltersValues((prev) => ({ ...prev, brand: brand ? brand : null }));
	}, [brand]);

	useEffect(() => {
		setFiltersValues((prev) => ({ ...prev, model: model ? model.replace('model-', '') : null }));
	}, [model]);

	useEffect(() => {
		setFiltersValues((prev) => ({
			...prev,
			generation: router.query.generation ? (router.query.generation as string) : null
		}));
	}, [router.query.generation]);

	useEffect(() => {
		setFiltersValues((prev) => ({
			...prev,
			kindSparePart: router.query.kindSparePart ? (router.query.kindSparePart as string) : null
		}));
	}, [router.query.kindSparePart]);

	const fetchKindSparePartsRef = useRef(async (value: string) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const controller = new AbortController();
		abortControllerRef.current = controller;
		try {
			const { data } = await fetchKindSpareParts(
				{ filters: { name: { $contains: value } } },
				{ abortController: controller }
			);
			setKindSpareParts(data);
		} catch (err) {
			if (!axios.isCancel(err)) {
				enqueueSnackbar(
					'Произошла какая-то ошибка при загрузке данных для автозаполнения, попробуйте снова или обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		}
		setIsLoading(false);
	});

	const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

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

	const handleOpenAutocompleteGeneration = (values: { [key: string]: string | null }) =>
		handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
			fetchGenerations({
				filters: { model: { slug: values.model as string }, brand: { slug: values.brand } },
				pagination: { limit: API_MAX_LIMIT }
			})
		);

	const handleOpenAutocompleteKindSparePart = () => async () => {
		if (
			kindSpareParts.data.length < API_DEFAULT_LIMIT &&
			kindSpareParts.meta.pagination?.total !== kindSpareParts.data.length
		) {
			setIsLoading(true);
			await loadKindSpareParts();
			setIsLoading(false);
		}
	};

	const handleOpenAutocompleteVolume = () =>
		handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
			fetchEngineVolumes({
				pagination: { limit: API_MAX_LIMIT }
			})
		);

	const handleInputChangeKindSparePart = (_: any, value: string) => {
		setIsLoading(true);
		debouncedFetchKindSparePartsRef(value);
	};

	const handleScrollKindSparePartAutocomplete: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement> = (
		event
	) => {
		if (
			event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
			event.currentTarget.scrollHeight
		) {
			throttledLoadMoreKindSpareParts();
		}
	};

	const handleChangeBrandAutocomplete = () => {
		setModels([]);
		setGenerations([]);
	};

	const handleChangeModelAutocomplete = () => {
		setGenerations([]);
	};

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const filtersConfig = getSparePartsFiltersConfig({
		brands,
		models,
		kindSpareParts: kindSpareParts.data,
		generations,
		noOptionsText,
		volumes,
		isLoadingMoreKindSpareParts: isLoadingMore,
		onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
		onChangeModelAutocomplete: handleChangeModelAutocomplete,
		onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
		onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
		onScrollKindSparePartAutocomplete: handleScrollKindSparePartAutocomplete,
		onInputChangeKindSparePart: handleInputChangeKindSparePart,
		onOpenAutoCompleteVolume: handleOpenAutocompleteVolume
	});

	const generateFiltersByQuery = (
		{
			brand,
			model,
			generation,
			kindSparePart,
			brandName,
			modelName,
			generationName,
			volume,
			fuel,
			bodyStyle,
			transmission,
			...others
		}: {
			[key: string]: string | null;
		},
		fetchFunc?: () => void
	): Filters => {
		let filters: Filters = {
			brand: getParamByRelation(brand, 'slug'),
			model: getParamByRelation(model, 'slug'),
			generation: getParamByRelation(generation, 'slug'),
			kindSparePart: getParamByRelation(kindSparePart, 'slug'),
			...(fetchFunc === fetchSpareParts
				? {
						volume: getParamByRelation(volume),
						fuel: fuel ? SLUGIFY_FUELS[fuel] : null,
						bodyStyle: bodyStyle ? SLUGIFY_BODY_STYLES[bodyStyle] : null,
						transmission: transmission ? SLUGIFY_TRANSMISSIONS[transmission] : null
				  }
				: {})
		};
		return { ...filters, ...others };
	};

	const handleChangeFilterValues = async (values: { [key: string]: string | null }) => {
		let newFilterValues = values;
		if (!values.brand) {
			newFilterValues = { ...newFilterValues, model: null, generation: null };
			setModels([]);
			setGenerations([]);
		}
		if (!values.model) {
			newFilterValues = { ...newFilterValues, generation: null };
			setGenerations([]);
		}
		setFiltersValues(newFilterValues);
		const { data } = await fetchSpareParts({
			filters: { ...generateFiltersByQuery(newFilterValues, fetchSpareParts), sold: false },
			pagination: { limit: 0 }
		});

		setTotal(data.meta.pagination?.total || 0);
	};

	return (
		<Catalog
			dataFieldsToShow={[
				{
					id: 'brand',
					name: 'Марка'
				},
				{
					id: 'model',
					name: 'Модель'
				},
				{
					id: 'kindSparePart',
					name: 'Запчасть'
				}
			]}
			brands={brands}
			models={models}
			filtersValues={filtersValues}
			onChangeFilterValues={handleChangeFilterValues}
			filtersConfig={filtersConfig}
			seo={page?.seo}
			total={total}
			onChangeTotal={setTotal}
			fetchData={fetchSpareParts}
			generateFiltersByQuery={generateFiltersByQuery}
		></Catalog>
	);
};

export default CatalogSpareParts;
