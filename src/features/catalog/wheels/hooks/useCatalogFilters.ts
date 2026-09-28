import { useState, useEffect } from 'react';
import type { WheelParsedQueryParams, WheelFilterValues } from '../types';

export const useCatalogFilters = (queryParams: WheelParsedQueryParams) => {
	const { kind, brand, model, width, diameter, numberHoles, diameterCenterHole, distanceBetweenCenters, diskOffset } =
		queryParams;

	const [filtersValues, setFiltersValues] = useState<WheelFilterValues>({
		kind: kind || null,
		brand: brand || null,
		model: model || null,
		width: width || null,
		diameter: diameter || null,
		numberHoles: numberHoles || null,
		diameterCenterHole: diameterCenterHole || null,
		distanceBetweenCenters: distanceBetweenCenters || null,
		diskOffset: diskOffset || null
	});

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, kind: kind || null }));
	}, [kind]);
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
		setFiltersValues((prev) => ({ ...prev, width: width || null }));
	}, [width]);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, diameter: diameter || null }));
	}, [diameter]);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, numberHoles: numberHoles || null }));
	}, [numberHoles]);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, diameterCenterHole: diameterCenterHole || null }));
	}, [diameterCenterHole]);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, distanceBetweenCenters: distanceBetweenCenters || null }));
	}, [distanceBetweenCenters]);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFiltersValues((prev) => ({ ...prev, diskOffset: diskOffset || null }));
	}, [diskOffset]);

	return {
		filtersValues,
		setFiltersValues
	};
};
