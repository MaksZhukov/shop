import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { wheelApi } from 'entities/wheel';
import { brandApi } from 'entities/brand';
import { modelApi } from 'entities/model';
import { wheelDiameterApi } from 'entities/wheelDiameter';
import { wheelWidthApi } from 'entities/wheelWidth';
import { wheelNumberHoleApi } from 'entities/wheelNumberHole';
import { wheelDiameterCenterHoleApi } from 'entities/wheelDiameterCenterHole';
import { wheelDiskOffsetApi } from 'entities/wheelDiskOffset';
import type { WheelFilterValues, WheelParsedQueryParams } from '../types';
import { generateFiltersByQuery } from '../utils';
import type { ModelWheelsCountWithGenerationsWheelsCount } from 'entities/model/modelTypes';
import type { BrandWithWheelsCount } from 'entities/brand';

interface UseCatalogDataParams {
	queryParams: WheelParsedQueryParams;
	filtersValues: WheelFilterValues;
}

export const useCatalogData = ({ queryParams, filtersValues }: UseCatalogDataParams) => {
	const {
		sort,
		page,
		kind,
		brand,
		model,
		width,
		diameter,
		numberHoles,
		diameterCenterHole,
		distanceBetweenCenters,
		diskOffset
	} = queryParams;
	const [diametersEnabled, setDiametersEnabled] = useState(false);
	const [widthsEnabled, setWidthsEnabled] = useState(false);
	const [numberHolesEnabled, setNumberHolesEnabled] = useState(false);
	const [diameterCenterHolesEnabled, setDiameterCenterHolesEnabled] = useState(false);
	const [diskOffsetsEnabled, setDiskOffsetsEnabled] = useState(false);

	const filterPayload = {
		kind: kind || null,
		brand: brand || null,
		model: model || null,
		width: width || null,
		diameter: diameter || null,
		numberHoles: numberHoles || null,
		diameterCenterHole: diameterCenterHole || null,
		distanceBetweenCenters: distanceBetweenCenters || null,
		diskOffset: diskOffset || null
	};

	const { data: wheels, isFetching } = useQuery({
		queryKey: ['wheels', sort, page, filterPayload],
		placeholderData: (prev) => prev,
		queryFn: () =>
			wheelApi.fetchWheels({
				filters: {
					...generateFiltersByQuery(filterPayload),
					sold: false
				},
				sort,
				populate: ['brand', 'images', 'model'],
				pagination: { start: (page - 1) * API_DEFAULT_LIMIT }
			})
	});
	const { data: totalWheels } = useQuery({
		queryKey: ['total-wheels', filtersValues],
		placeholderData: (prev) => prev,
		queryFn: () =>
			wheelApi.fetchWheels({
				filters: { ...generateFiltersByQuery(filtersValues), sold: false },
				pagination: { limit: 0 }
			})
	});

	const { data: brandsData, isFetching: isLoadingBrands } = useQuery({
		queryKey: ['brands-wheels'],
		queryFn: () =>
			brandApi.fetchBrands<BrandWithWheelsCount>({
				pagination: { limit: API_MAX_LIMIT },
				sort: 'name',
				populate: { image: true, wheels: { count: true } },
				filters: {
					wheels: {
						id: { $notNull: true },
						sold: false
					}
				}
			})
	});

	const { data: modelsData, isFetching: isLoadingModels } = useQuery({
		queryKey: ['models-wheels', brand || filtersValues.brand],
		enabled: !!(brand || filtersValues.brand),
		queryFn: () =>
			modelApi.fetchModels<ModelWheelsCountWithGenerationsWheelsCount>({
				pagination: { limit: API_MAX_LIMIT },
				sort: 'name',
				populate: { wheels: { count: true } },
				filters: {
					brand: { slug: (brand || filtersValues.brand) ?? '' },
					wheels: {
						id: { $notNull: true },
						sold: false
					}
				}
			})
	});

	const { data: diametersData, isFetching: isLoadingDiameters } = useQuery({
		queryKey: ['wheel-diameters'],
		enabled: diametersEnabled,
		queryFn: () =>
			wheelDiameterApi.fetchWheelDiameters({
				pagination: { limit: API_MAX_LIMIT }
			})
	});

	const { data: widthsData, isFetching: isLoadingWidths } = useQuery({
		queryKey: ['wheel-widths'],
		enabled: widthsEnabled,
		queryFn: () =>
			wheelWidthApi.fetchWheelWidths({
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const { data: numberHolesData, isFetching: isLoadingNumberHoles } = useQuery({
		queryKey: ['wheel-number-holes'],
		enabled: numberHolesEnabled,
		queryFn: () =>
			wheelNumberHoleApi.fetchWheelNumberHoles({
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const { data: diameterCenterHolesData, isFetching: isLoadingDiameterCenterHoles } = useQuery({
		queryKey: ['wheel-diameter-center-holes'],
		enabled: diameterCenterHolesEnabled,
		queryFn: () =>
			wheelDiameterCenterHoleApi.fetchWheelDiameterCenterHoles({
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const { data: diskOffsetsData, isFetching: isLoadingDiskOffsets } = useQuery({
		queryKey: ['wheel-disk-offsets'],
		enabled: diskOffsetsEnabled,
		queryFn: () =>
			wheelDiskOffsetApi.fetchWheelDiskOffsets({
				pagination: { limit: API_MAX_LIMIT }
			}),
		select: (data) => data.data?.data?.map((item) => ({ id: item.id.toString(), name: item.name.toString() })) ?? []
	});

	const brands = brandsData?.data?.data ?? [];
	const models = modelsData?.data?.data ?? [];
	const diameters = diametersData?.data?.data ?? [];
	const widths = widthsData ?? [];
	const numberHolesList = numberHolesData ?? [];
	const diameterCenterHoles = diameterCenterHolesData ?? [];
	const diskOffsets = diskOffsetsData ?? [];

	const pageCount = Math.ceil((wheels?.data?.meta?.pagination?.total || 0) / API_DEFAULT_LIMIT);
	const total = totalWheels?.data?.meta?.pagination?.total;

	return {
		wheels: wheels?.data?.data || [],
		isLoading: isFetching,
		pageCount,
		total,
		brands,
		models,
		diameters,
		widths,
		numberHoles: numberHolesList,
		diameterCenterHoles,
		diskOffsets,
		catalogCategories: [],
		onOpenDiameterAutocomplete: () => setDiametersEnabled(true),
		onOpenWidthAutocomplete: () => setWidthsEnabled(true),
		onOpenNumberHolesAutocomplete: () => setNumberHolesEnabled(true),
		onOpenDiameterCenterHoleAutocomplete: () => setDiameterCenterHolesEnabled(true),
		onOpenDiskOffsetAutocomplete: () => setDiskOffsetsEnabled(true),
		isLoadingBrands,
		isLoadingModels,
		isLoadingDiameters,
		isLoadingWidths,
		isLoadingNumberHoles,
		isLoadingDiameterCenterHoles,
		isLoadingDiskOffsets
	};
};
