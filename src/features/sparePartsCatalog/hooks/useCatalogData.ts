import { useState, type Dispatch, type SetStateAction } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { sparePartApi } from 'entities/sparePart';
import { modelApi, ModelSparePartsCountWithGenerationsSparePartsCount } from 'entities/model';
import { generationApi } from 'entities/generation';
import type { Generation } from 'entities/generation';
import { EngineVolume } from 'entities/engineVolume';
import { catalogApi, TopCategory } from 'entities/catalog';
import type { FilterValues, ParsedQueryParams } from '../types';
import { generateFiltersByQuery } from '../utils';
import { sparePartsBrandsQueryKey } from '../constants';
import { sparePartsPageQueryFns } from '../sparePartsPageQueries';

interface UseCatalogDataParams {
	queryParams: ParsedQueryParams;
	filtersValues: FilterValues;
}

const brandSlug = (brand: string | undefined, filtersBrand: string | null) => filtersBrand || brand || '';

export const useCatalogData = ({ queryParams, filtersValues }: UseCatalogDataParams) => {
	const { sort, page, brand, model, generation, kindSparePartSlug, volume, fuel, bodyStyle, transmission } =
		queryParams;
	const queryClient = useQueryClient();
	const [volumes, setVolumes] = useState<EngineVolume[]>([]);
	const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);

	const currentBrandSlug = brandSlug(brand, filtersValues.brand);

	const brandsDataFilters = {
		kindSparePart: filtersValues.kindSparePart,
		model: filtersValues.model,
		generation: filtersValues.generation,
		volume: filtersValues.volume,
		fuel: filtersValues.fuel,
		bodyStyle: filtersValues.bodyStyle,
		transmission: filtersValues.transmission
	};

	const { data: brands = [] } = useQuery({
		queryKey: sparePartsBrandsQueryKey(brandsDataFilters),
		queryFn: sparePartsPageQueryFns.fetchBrandsData(brandsDataFilters)
	});

	const { data: spareParts, isFetching } = useQuery({
		queryKey: [
			'spare-parts',
			sort,
			page,
			brand,
			model,
			generation,
			kindSparePartSlug,
			volume,
			fuel,
			bodyStyle,
			transmission
		],
		placeholderData: (prev) => prev,
		queryFn: () =>
			sparePartApi.fetchSpareParts({
				filters: {
					...generateFiltersByQuery({
						brand: brand || null,
						model: model || null,
						generation: generation || null,
						kindSparePart: kindSparePartSlug || null,
						volume: volume || null,
						fuel: fuel || null,
						bodyStyle: bodyStyle || null,
						transmission: transmission || null
					}),
					sold: false
				},
				sort,
				populate: ['brand', 'images'],
				pagination: { start: (page - 1) * API_DEFAULT_LIMIT }
			})
	});

	// Fetch total spare parts count
	const { data: totalSpareParts } = useQuery({
		queryKey: [
			'total-spare-parts',
			filtersValues.brand,
			filtersValues.model,
			filtersValues.kindSparePart,
			filtersValues.volume,
			filtersValues.fuel,
			filtersValues.bodyStyle,
			filtersValues.transmission,
			filtersValues.generation
		],
		placeholderData: (prev) => prev,
		queryFn: () =>
			sparePartApi.fetchSpareParts({
				filters: { ...generateFiltersByQuery(filtersValues), sold: false },
				pagination: { limit: 0 }
			})
	});

	const { data: catalogCategories } = useQuery({
		queryKey: ['catalogTopCategories'],
		placeholderData: (prev) => prev,
		queryFn: () => catalogApi.fetchTopCategories()
	});

	const { data: modelsData } = useQuery({
		queryKey: ['spare-parts-models', currentBrandSlug, filtersValues.kindSparePart],
		enabled: !!currentBrandSlug,
		placeholderData: (prev) => prev,
		queryFn: () => {
			return modelApi.fetchModels<ModelSparePartsCountWithGenerationsSparePartsCount>({
				pagination: { limit: API_MAX_LIMIT },
				filters: {
					brand: { slug: currentBrandSlug },
					spareParts: {
						...(filtersValues.kindSparePart && { kindSparePart: { slug: filtersValues.kindSparePart } })
					}
				},
				populate: {
					generations: {
						populate: {
							spareParts: {
								count: true,
								filters: {
									brand: { slug: currentBrandSlug },
									sold: false,
									...(filtersValues.kindSparePart && {
										kindSparePart: { slug: filtersValues.kindSparePart }
									})
								}
							}
						},
						filters: {
							brand: { slug: currentBrandSlug },
							spareParts: {
								sold: false,
								...(filtersValues.kindSparePart && {
									kindSparePart: { slug: filtersValues.kindSparePart }
								})
							}
						}
					}
				}
			});
		}
	});

	const { data: generationsData } = useQuery({
		queryKey: ['spare-parts-generations', brand, model],
		enabled: !!(brand && model),
		placeholderData: (prev) => prev,
		queryFn: () =>
			generationApi.fetchGenerations({
				filters: { model: { slug: model! }, brand: { slug: brand! } },
				pagination: { limit: API_MAX_LIMIT }
			})
	});

	const models = modelsData?.data?.data ?? [];
	const generations = generationsData?.data?.data ?? [];

	const setModels: Dispatch<SetStateAction<ModelSparePartsCountWithGenerationsSparePartsCount[]>> = (value) => {
		queryClient.setQueryData(
			['spare-parts-models', currentBrandSlug],
			(prev: { data: { data: ModelSparePartsCountWithGenerationsSparePartsCount[] } } | undefined) => {
				const next =
					typeof value === 'function'
						? (
								value as (
									prev: ModelSparePartsCountWithGenerationsSparePartsCount[]
								) => ModelSparePartsCountWithGenerationsSparePartsCount[]
							)(prev?.data?.data ?? [])
						: value;
				return prev ? { ...prev, data: { ...prev.data, data: next } } : { data: { data: next } };
			}
		);
	};

	const setGenerations: Dispatch<SetStateAction<Generation[]>> = (value) => {
		queryClient.setQueryData(
			['spare-parts-generations', brand, model],
			(prev: { data: { data: Generation[] } } | undefined) => {
				const next =
					typeof value === 'function'
						? (value as (prev: Generation[]) => Generation[])(prev?.data?.data ?? [])
						: value;
				return prev ? { ...prev, data: { ...prev.data, data: next } } : { data: { data: next } };
			}
		);
	};

	const pageCount = Math.ceil((spareParts?.data?.meta?.pagination?.total || 0) / API_DEFAULT_LIMIT);
	const total = totalSpareParts?.data?.meta?.pagination?.total;

	return {
		spareParts: spareParts?.data?.data || [],
		isLoading: isFetching,
		pageCount,
		total,
		models,
		brands,
		setModels,
		generations,
		setGenerations,
		volumes,
		setVolumes,
		catalogCategories: catalogCategories?.data.data || [],
		hoveredCategory,
		setHoveredCategory
	};
};
