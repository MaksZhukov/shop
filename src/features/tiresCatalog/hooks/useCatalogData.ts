import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { tireApi } from 'entities/tire';
import { tireBrandApi } from 'entities/tireBrand';
import { tireWidthApi } from 'entities/tireWidth';
import { tireHeightApi } from 'entities/tireHeight';
import { tireDiameterApi } from 'entities/tireDiameter';
import type { TopCategory } from 'entities/catalog';
import type { TireFilterValues, TireParsedQueryParams } from '../types';
import { generateFiltersByQuery } from '../utils';
import type { TireBrandWithCount } from 'entities/tireBrand';

interface UseCatalogDataParams {
	queryParams: TireParsedQueryParams;
	filtersValues: TireFilterValues;
}

export const useCatalogData = ({ queryParams, filtersValues }: UseCatalogDataParams) => {
	const { sort, page, brand, width, height, diameter, season } = queryParams;
	const [widthsEnabled, setWidthsEnabled] = useState(false);
	const [heightsEnabled, setHeightsEnabled] = useState(false);
	const [diametersEnabled, setDiametersEnabled] = useState(false);

	const { data: tires, isFetching } = useQuery({
		queryKey: ['tires', sort, page, brand, width, height, diameter, season],
		placeholderData: (prev) => prev,
		queryFn: () =>
			tireApi.fetchTires({
				filters: {
					...generateFiltersByQuery({
						brand: brand || null,
						width: width || null,
						height: height || null,
						diameter: diameter || null,
						season: season || null
					}),
					sold: false
				},
				sort,
				populate: ['brand', 'images'],
				pagination: { start: (page - 1) * API_DEFAULT_LIMIT }
			})
	});

	const { data: totalTires } = useQuery({
		queryKey: [
			'total-tires',
			filtersValues.brand,
			filtersValues.width,
			filtersValues.height,
			filtersValues.diameter,
			filtersValues.season
		],
		placeholderData: (prev) => prev,
		queryFn: () =>
			tireApi.fetchTires({
				filters: { ...generateFiltersByQuery(filtersValues), sold: false },
				pagination: { limit: 0 }
			})
	});

	const { data: tireBrandsData, isFetching: isLoadingBrands } = useQuery({
		queryKey: ['tire-brands'],
		placeholderData: (prev) => prev,
		queryFn: () =>
			tireBrandApi.fetchTireBrands<TireBrandWithCount>({
				pagination: { limit: API_MAX_LIMIT },
				sort: 'name',
				populate: { image: true, tires: { count: true } },
				filters: {
					tires: {
						id: { $notNull: true },
						sold: false
					}
				}
			})
	});

	const { data: widthsData, isFetching: isLoadingWidths } = useQuery({
		queryKey: ['tire-widths', filtersValues.brand],
		enabled: widthsEnabled,
		queryFn: () =>
			tireWidthApi.fetchTireWidths({
				filters: { tires: { brand: { slug: filtersValues.brand || null } } },
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const { data: heightsData, isFetching: isLoadingHeights } = useQuery({
		queryKey: ['tire-heights', filtersValues.brand],
		enabled: heightsEnabled,
		queryFn: () =>
			tireHeightApi.fetchTireHeights({
				filters: { tires: { brand: { slug: filtersValues.brand || null } } },
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const { data: diametersData, isFetching: isLoadingDiameters } = useQuery({
		queryKey: ['tire-diameters', filtersValues.brand],
		enabled: diametersEnabled,
		queryFn: () =>
			tireDiameterApi.fetchTireDiameters({
				filters: { tires: { brand: { slug: filtersValues.brand || null } } },
				pagination: { limit: API_MAX_LIMIT }
			})
	});

	const tireBrands = tireBrandsData?.data?.data ?? [];
	const widths = widthsData ?? [];
	const heights = heightsData ?? [];
	const diameters = diametersData?.data?.data ?? [];

	const pageCount = Math.ceil((tires?.data?.meta?.pagination?.total || 0) / API_DEFAULT_LIMIT);
	const total = totalTires?.data?.meta?.pagination?.total;

	return {
		tires: tires?.data?.data || [],
		isLoading: isFetching,
		pageCount,
		total,
		tireBrands,
		widths,
		heights,
		diameters,
		catalogCategories: [] as TopCategory[],
		onOpenWidthAutocomplete: () => setWidthsEnabled(true),
		onOpenHeightAutocomplete: () => setHeightsEnabled(true),
		onOpenDiameterAutocomplete: () => setDiametersEnabled(true),
		isLoadingBrands,
		isLoadingWidths,
		isLoadingHeights,
		isLoadingDiameters
	};
};
