import { useState, useEffect } from 'react';
import { ParsedQueryParams, FilterValues } from '../types';

export const useCatalogFilters = (queryParams: ParsedQueryParams) => {
	const { brand, model, generation, kindSparePartSlug, volume, fuel, bodyStyle, transmission } = queryParams;

	const [filtersValues, setFiltersValues] = useState<FilterValues>({
		brand: brand || null,
		model: model || null,
		generation: generation || null,
		kindSparePart: kindSparePartSlug || null,
		volume: volume || null,
		fuel: fuel || null,
		bodyStyle: bodyStyle || null,
		transmission: transmission || null
	});

	// Sync filters with query params
	useEffect(() => {
		setFiltersValues((prev) => ({ ...prev, brand: brand || null }));
	}, [brand]);

	useEffect(() => {
		setFiltersValues((prev) => ({ ...prev, model: model || null }));
	}, [model]);

	useEffect(() => {
		setFiltersValues((prev) => ({ ...prev, generation: generation || null }));
	}, [generation]);

	useEffect(() => {
		setFiltersValues((prev) => ({ ...prev, kindSparePart: kindSparePartSlug || null }));
	}, [kindSparePartSlug]);

	return {
		filtersValues,
		setFiltersValues
	};
};

