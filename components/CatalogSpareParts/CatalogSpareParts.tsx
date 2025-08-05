import { CircularProgress } from '@mui/material';
import { BrandWithSparePartsCount } from 'api/brands/types';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'api/constants';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/engineVolumes';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart, KindSparePartWithSparePartsCount } from 'api/kindSpareParts/types';
import { fetchModels } from 'api/models/models';
import { ModelSparePartsCountWithGenerationsSparePartsCount } from 'api/models/types';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { ApiResponse, Filters } from 'api/types';
import axios, { AxiosResponse } from 'axios';
import Catalog from 'components/Catalog';
import { getSparePartsFiltersConfig } from 'components/features/Filters/config';
import { SLUGIFY_BODY_STYLES, SLUGIFY_FUELS, SLUGIFY_TRANSMISSIONS } from 'config';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, FC, SetStateAction, UIEventHandler, useEffect, useRef, useState } from 'react';
import { useDebounce, useThrottle } from 'rooks';
import { getParamByRelation } from 'services/ParamsService';
import { OFFSET_SCROLL_LOAD_MORE } from '../../constants';
import { useQuery } from '@tanstack/react-query';
import { DefaultPage } from 'api/pages/types';

type QueryParams = {
	sort: string;
	page: string;
	slug: [string, string];
	generation: string;
	kindSparePart: string;
	volume: string;
	fuel: string;
	bodyStyle: string;
	transmission: string;
};

interface Props {
	brands: BrandWithSparePartsCount[];
	kindSparePart?: KindSparePart;
	pageData: DefaultPage;
}

const CatalogSpareParts: FC<Props> = ({ brands = [], kindSparePart, pageData }) => {
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
	const [hoveredCategory, setHoveredCategory] = useState<any | null>(null);
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();
	const {
		sort = 'createdAt:desc',
		page: pageParam = '1',
		generation,
		kindSparePart: kindSparePartSlug,
		volume,
		fuel,
		bodyStyle,
		transmission,
		slug
	} = router.query as unknown as QueryParams;
	const page = +pageParam;
	const [brand, modelParam] = slug || [];
	const model = modelParam ? modelParam.replace('model-', '') : '';

	const [filtersValues, setFiltersValues] = useState<{ [key: string]: string | null }>({
		brand: brand,
		model: model,
		kindSparePart: kindSparePartSlug,
		volume: volume,
		fuel: fuel,
		bodyStyle: bodyStyle,
		transmission: transmission
	});

	const { data: spareParts, isFetching } = useQuery({
		queryKey: ['spare-parts', sort, page, brand, model, kindSparePartSlug, volume, fuel, bodyStyle, transmission],
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchSpareParts({
				filters: {
					...generateFiltersByQuery({
						brand,
						model,
						kindSparePart: kindSparePartSlug,
						volume,
						fuel,
						bodyStyle,
						transmission
					}),
					sold: false
				},
				populate: ['brand', 'images'],
				pagination: { start: (page - 1) * API_DEFAULT_LIMIT }
			})
	});

	const { data: totalSpareParts } = useQuery({
		queryKey: [
			'total-spare-parts',
			filtersValues.brand,
			filtersValues.model,
			filtersValues.kindSparePart,
			filtersValues.volume,
			filtersValues.fuel,
			filtersValues.bodyStyle,
			filtersValues.transmission
		],
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchSpareParts({
				filters: { ...generateFiltersByQuery(filtersValues), sold: false },
				pagination: { limit: 0 }
			})
	});
	const pageCount = Math.ceil((spareParts?.data?.meta?.pagination?.total || 0) / API_DEFAULT_LIMIT);
	const total = totalSpareParts?.data?.meta?.pagination?.total || null;

	const { data: catalogCategories } = useQuery({
		queryKey: ['catalogCategories'],
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchKindSpareParts<KindSparePartWithSparePartsCount>({
				pagination: { limit: 10 },
				filters: {
					id: [12, 13, 14, 15, 16, 17, 18, 21, 23, 25, 26]
				},
				populate: { spareParts: { count: true } }
			})
	});
	const { data: relatedCatalogCategories } = useQuery({
		queryKey: ['relatedCatalogCategories', hoveredCategory?.id],
		enabled: !!hoveredCategory,
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchKindSpareParts<KindSparePartWithSparePartsCount>({
				pagination: { limit: Math.floor(Math.random() * 15), start: Math.floor(Math.random() * 100) },
				populate: { spareParts: { count: true } }
			})
	});

	useEffect(() => {
		if (kindSparePart) {
			setKindSpareParts({
				data: [kindSparePart],
				meta: {}
			});
		}
	}, [kindSparePart]);

	useEffect(() => {
		if (generation) {
			handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
				fetchGenerations({
					filters: { model: { slug: model }, brand: { slug: brand } },
					pagination: { limit: API_MAX_LIMIT }
				})
			)();
		}
	}, [generation]);

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
		setFiltersValues((prev) => ({ ...prev, brand: brand }));
	}, [brand]);

	useEffect(() => {
		setFiltersValues((prev) => ({ ...prev, model: model }));
	}, [model]);

	useEffect(() => {
		setFiltersValues((prev) => ({
			...prev,
			generation: generation
		}));
	}, [generation]);

	useEffect(() => {
		setFiltersValues((prev) => ({
			...prev,
			kindSparePart: kindSparePartSlug
		}));
	}, [kindSparePartSlug]);

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

	const generateFiltersByQuery = ({
		brand,
		model,
		generation,
		kindSparePart,
		volume,
		fuel,
		bodyStyle,
		transmission
	}: {
		[key: string]: string | null;
	}): Filters => {
		const filters: Filters = {
			brand: getParamByRelation(brand, 'slug'),
			model: getParamByRelation(model, 'slug'),
			generation: getParamByRelation(generation, 'slug'),
			kindSparePart: getParamByRelation(kindSparePart, 'slug'),
			volume: getParamByRelation(volume),
			fuel: fuel ? SLUGIFY_FUELS[fuel] : null,
			bodyStyle: bodyStyle ? SLUGIFY_BODY_STYLES[bodyStyle] : null,
			transmission: transmission ? SLUGIFY_TRANSMISSIONS[transmission] : null
		};
		return filters;
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
	};

	const handleClickFind = () => {
		const slug: string[] = [];
		const { brand: brandValue, model: modelValue, ...restFiltersValues } = filtersValues;
		if (brandValue) {
			slug.push(brandValue);
		}
		if (modelValue) {
			slug.push('model-' + modelValue);
		}
		Object.keys(restFiltersValues).forEach((key) => {
			if (restFiltersValues[key]) {
				router.query[key] = restFiltersValues[key];
			} else {
				delete router.query[key];
			}
		});
		router.query['slug'] = slug;
		router.query['page'] = '1';

		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
	};

	const handleChangeSort = (sort: string) => {
		router.query.sort = sort;
		router.push({ pathname: router.pathname, query: router.query });
	};

	return (
		<Catalog
			brands={brands}
			models={models}
			filtersValues={filtersValues}
			onChangeFilterValues={handleChangeFilterValues}
			filtersConfig={filtersConfig}
			seo={pageData.seo}
			total={total}
			onClickFind={handleClickFind}
			data={spareParts?.data?.data || []}
			isLoading={isFetching}
			pageCount={pageCount}
			page={page}
			sort={sort}
			onChangeSort={handleChangeSort}
			catalogCategories={catalogCategories?.data.data || []}
			relatedCatalogCategories={relatedCatalogCategories?.data.data || []}
			hoveredCategory={hoveredCategory}
			onChangeHoveredCategory={setHoveredCategory}
		></Catalog>
	);
};

export default CatalogSpareParts;
