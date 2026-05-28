import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { cabinApi } from 'entities/cabin';
import { modelApi, ModelCabinsCount } from 'entities/model';
import { generationApi } from 'entities/generation';
import type { Generation, GenerationWithCabinsCount } from 'entities/generation';
import type { CabinsFilterValues, CabinsParsedQueryParams } from '../types';
import { generateCabinsFiltersByQuery } from '../utils';
import type { Dispatch, SetStateAction } from 'react';
import { cabinsBrandsQueryKey } from '../constants';
import { cabinsPageQueryFns } from '../cabinsPageQueries';

interface UseCabinsCatalogDataParams {
	queryParams: CabinsParsedQueryParams;
	filtersValues: CabinsFilterValues;
}

const brandSlug = (brand: string | undefined, filtersBrand: string | null) => filtersBrand || brand || '';

export const useCabinsCatalogData = ({ queryParams, filtersValues }: UseCabinsCatalogDataParams) => {
	const { sort, page, brand, model, generation, kindSparePartSlug } = queryParams;
	const queryClient = useQueryClient();

	const currentBrandSlug = brandSlug(brand, filtersValues.brand);
	const currentModelSlug = model || filtersValues.model;
	const currentKindSparePartSlug = filtersValues.kindSparePart || kindSparePartSlug;
	const { data: cabins, isFetching } = useQuery({
		queryKey: ['cabins', sort, page, brand, model, generation, kindSparePartSlug],
		placeholderData: (prev) => prev,
		queryFn: () =>
			cabinApi.fetchCabins({
				filters: {
					...generateCabinsFiltersByQuery({
						brand: brand || null,
						model: model || null,
						generation: generation || null,
						kindSparePart: kindSparePartSlug || null
					}),
					sold: false
				},
				sort,
				populate: ['brand', 'images'],
				pagination: { start: (page - 1) * API_DEFAULT_LIMIT, limit: API_DEFAULT_LIMIT }
			})
	});

	const { data: brandsData = [] } = useQuery({
		queryKey: cabinsBrandsQueryKey(filtersValues.kindSparePart),
		queryFn: cabinsPageQueryFns.fetchBrandsData(filtersValues.kindSparePart)
	});

	const { data: totalCabins } = useQuery({
		queryKey: [
			'total-cabins',
			filtersValues.brand,
			filtersValues.model,
			filtersValues.kindSparePart,
			filtersValues.generation
		],
		placeholderData: (prev) => prev,
		queryFn: () =>
			cabinApi.fetchCabins({
				filters: { ...generateCabinsFiltersByQuery(filtersValues), sold: false },
				pagination: { limit: 0 }
			})
	});

	const cabinsModelFilters = {
		sold: false,
		id: { $notNull: true },
		...(currentKindSparePartSlug && { kindSparePart: { slug: currentKindSparePartSlug } })
	};

	const { data: modelsData } = useQuery({
		queryKey: ['cabins-models', currentBrandSlug, currentKindSparePartSlug],
		enabled: !!currentBrandSlug,
		placeholderData: (prev) => prev,
		queryFn: () =>
			modelApi.fetchModels<ModelCabinsCount>({
				filters: {
					brand: { slug: currentBrandSlug },
					cabins: cabinsModelFilters
				},
				pagination: { limit: API_MAX_LIMIT },
				sort: 'name',
				populate: {
					cabins: {
						count: true,
						filters: {
							brand: { slug: currentBrandSlug },
							...cabinsModelFilters
						}
					}
				}
			})
	});

	const { data: generationsData } = useQuery({
		queryKey: ['cabins-generations', currentBrandSlug, currentModelSlug, currentKindSparePartSlug],
		enabled: !!(currentBrandSlug && currentModelSlug),
		placeholderData: (prev) => prev,
		queryFn: () =>
			generationApi.fetchGenerations<GenerationWithCabinsCount>({
				filters: {
					model: { slug: currentModelSlug! },
					brand: { slug: currentBrandSlug },
					cabins: cabinsModelFilters
				},
				populate: {
					cabins: {
						count: true,
						filters: {
							brand: { slug: currentBrandSlug },
							model: { slug: currentModelSlug! },
							...cabinsModelFilters
						}
					}
				},
				pagination: { limit: API_MAX_LIMIT }
			})
	});

	const models = modelsData?.data?.data ?? [];
	const generations = generationsData?.data?.data ?? [];

	const setModels: Dispatch<SetStateAction<ModelCabinsCount[]>> = (value) => {
		queryClient.setQueryData(
			['cabins-models', currentBrandSlug, currentKindSparePartSlug],
			(prev: { data: { data: ModelCabinsCount[] } } | undefined) => {
				const next =
					typeof value === 'function'
						? (value as (prev: ModelCabinsCount[]) => ModelCabinsCount[])(prev?.data?.data ?? [])
						: value;
				return prev ? { ...prev, data: { ...prev.data, data: next } } : { data: { data: next } };
			}
		);
	};

	const setGenerations: Dispatch<SetStateAction<Generation[]>> = (value) => {
		queryClient.setQueryData(
			['cabins-generations', currentBrandSlug, currentModelSlug, currentKindSparePartSlug],
			(prev: { data: { data: Generation[] } } | undefined) => {
				const next =
					typeof value === 'function'
						? (value as (prev: Generation[]) => Generation[])(prev?.data?.data ?? [])
						: value;
				return prev ? { ...prev, data: { ...prev.data, data: next } } : { data: { data: next } };
			}
		);
	};

	const total = totalCabins?.data?.meta?.pagination?.total ?? 0;
	const pageCount = Math.ceil(total / API_DEFAULT_LIMIT);

	return {
		cabins: cabins?.data?.data ?? [],
		isLoading: isFetching,
		pageCount,
		total,
		brands: brandsData,
		models,
		setModels,
		generations,
		setGenerations
	};
};
