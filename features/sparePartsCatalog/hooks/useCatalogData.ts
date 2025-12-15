import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { sparePartApi } from 'entities/sparePart';
import { modelApi, ModelSparePartsCountWithGenerationsSparePartsCount } from 'entities/model';
import { generationApi } from 'entities/generation';
import { Generation } from 'entities/generation/generationTypes';
import { engineVolumeApi, EngineVolume } from 'entities/engineVolume';
import { catalogApi, TopCategory } from 'entities/catalog';
import { FilterValues, ParsedQueryParams } from '../types';
import { generateFiltersByQuery } from '../utils';

interface UseCatalogDataParams {
	queryParams: ParsedQueryParams;
	filtersValues: FilterValues;
}

export const useCatalogData = ({ queryParams, filtersValues }: UseCatalogDataParams) => {
	const { sort, page, brand, model, generation, kindSparePartSlug, volume, fuel, bodyStyle, transmission } =
		queryParams;

	const [models, setModels] = useState<ModelSparePartsCountWithGenerationsSparePartsCount[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [volumes, setVolumes] = useState<EngineVolume[]>([]);
	const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);

	// Fetch spare parts
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

	// Fetch catalog categories
	const { data: catalogCategories } = useQuery({
		queryKey: ['catalogTopCategories'],
		placeholderData: (prev) => prev,
		queryFn: () => catalogApi.fetchTopCategories()
	});

	// Fetch models when brand changes
	useEffect(() => {
		const fetchModels = async () => {
			const result = await modelApi.fetchModels<ModelSparePartsCountWithGenerationsSparePartsCount>({
				filters: { brand: { slug: filtersValues.brand || brand } },
				pagination: { limit: API_MAX_LIMIT },
				populate: { generations: { populate: { spareParts: { count: true, filters: { sold: false } } } } }
			});
			setModels(result.data.data);
		};

		if (brand || filtersValues.brand) {
			fetchModels();
		}
	}, [brand, filtersValues.brand]);

	// Fetch generations when generation param exists
	useEffect(() => {
		if (generation && model && brand) {
			const fetchGenerations = async () => {
				const result = await generationApi.fetchGenerations({
					filters: { model: { slug: model }, brand: { slug: brand } },
					pagination: { limit: API_MAX_LIMIT }
				});
				setGenerations(result.data.data);
			};
			fetchGenerations();
		}
	}, [generation, model, brand]);

	const pageCount = Math.ceil((spareParts?.data?.meta?.pagination?.total || 0) / API_DEFAULT_LIMIT);
	const total = totalSpareParts?.data?.meta?.pagination?.total || null;

	return {
		spareParts: spareParts?.data?.data || [],
		isLoading: isFetching,
		pageCount,
		total,
		models,
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

