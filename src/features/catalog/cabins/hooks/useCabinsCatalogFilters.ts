import { useState, useEffect } from 'react';
import type { CabinsParsedQueryParams, CabinsFilterValues } from '../types';

export const useCabinsCatalogFilters = (queryParams: CabinsParsedQueryParams) => {
	const { brand, model, generation, kindSparePartSlug } = queryParams;

	const [filtersValues, setFiltersValues] = useState<CabinsFilterValues>({
		brand: brand || null,
		model: model || null,
		generation: generation || null,
		kindSparePart: kindSparePartSlug || null
	});

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, brand: brand || null }));
	}, [brand]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, model: model || null }));
	}, [model]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, generation: generation || null }));
	}, [generation]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, kindSparePart: kindSparePartSlug || null }));
	}, [kindSparePartSlug]);

	return {
		filtersValues,
		setFiltersValues
	};
};
