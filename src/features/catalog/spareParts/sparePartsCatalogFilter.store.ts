import { atom } from '@reatom/core';
import type { FilterValues, ParsedQueryParams } from './types';

const defaultFilterValues: FilterValues = {
	brand: null,
	model: null,
	generation: null,
	kindSparePart: null,
	volume: null,
	fuel: null,
	bodyStyle: null,
	transmission: null
};

const filtersValuesAtom = atom<FilterValues>({ ...defaultFilterValues }, 'sparePartsCatalog.filters');

export const sparePartsCatalogFilterStore = {
	get filtersValues() {
		return filtersValuesAtom();
	},
	setFiltersValues(values: FilterValues) {
		filtersValuesAtom.set((current) => ({ ...current, ...values }));
	},
	syncFromQueryParams({
		brand,
		model,
		generation,
		kindSparePartSlug,
		volume,
		fuel,
		bodyStyle,
		transmission
	}: ParsedQueryParams) {
		filtersValuesAtom.set((current) => ({
			...current,
			brand: brand ?? null,
			model: model ?? null,
			generation: generation ?? null,
			kindSparePart: kindSparePartSlug ?? null,
			volume: volume ?? null,
			fuel: fuel ?? null,
			bodyStyle: bodyStyle ?? null,
			transmission: transmission ?? null
		}));
	}
};
