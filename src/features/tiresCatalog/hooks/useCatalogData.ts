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

interface UseCatalogDataParams {
	queryParams: TireParsedQueryParams;
	filtersValues: TireFilterValues;
}

export const useCatalogData = ({ queryParams, filtersValues }: UseCatalogDataParams) => {
	const { sort, page, brand, width, height, diameter, season } = queryParams;
	const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);

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

	const { data: tireBrandsData } = useQuery({
		queryKey: ['tire-brands'],
		queryFn: () =>
			tireBrandApi.fetchTireBrands({
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

	const { data: widthsData } = useQuery({
		queryKey: ['tire-widths'],
		queryFn: () =>
			tireWidthApi.fetchTireWidths({
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const { data: heightsData } = useQuery({
		queryKey: ['tire-heights'],
		queryFn: () =>
			tireHeightApi.fetchTireHeights({
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const { data: diametersData } = useQuery({
		queryKey: ['tire-diameters'],
		queryFn: () =>
			tireDiameterApi.fetchTireDiameters({
				pagination: { limit: API_MAX_LIMIT }
			})
	});

	const tireBrands = tireBrandsData?.data?.data ?? [];
	const widths = widthsData ?? [];
	const heights = heightsData ?? [];
	console.log(heights);
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
		hoveredCategory,
		setHoveredCategory
	};
};
