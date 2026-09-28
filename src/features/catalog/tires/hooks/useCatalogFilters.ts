import { useState, useEffect } from 'react';
import type { TireParsedQueryParams, TireFilterValues } from '../types';

export const useCatalogFilters = (queryParams: TireParsedQueryParams) => {
	const { brand, width, height, diameter, season } = queryParams;

	const [filtersValues, setFiltersValues] = useState<TireFilterValues>({
		brand: brand || null,
		width: width || null,
		height: height || null,
		diameter: diameter || null,
		season: season || null
	});

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, brand: brand || null }));
	}, [brand]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, width: width || null }));
	}, [width]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, height: height || null }));
	}, [height]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, diameter: diameter || null }));
	}, [diameter]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, season: season || null }));
	}, [season]);

	return {
		filtersValues,
		setFiltersValues
	};
};
