import { makeAutoObservable } from 'mobx';
import type { FilterValues, ParsedQueryParams } from '../types';

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

export class SparePartsCatalogFilterStore {
	filtersValues: FilterValues = { ...defaultFilterValues };

	constructor() {
		makeAutoObservable(this);
	}

	setFiltersValues(values: FilterValues) {
		this.filtersValues = { ...this.filtersValues, ...values };
	}

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
		this.filtersValues = {
			...this.filtersValues,
			brand: brand ?? null,
			model: model ?? null,
			generation: generation ?? null,
			kindSparePart: kindSparePartSlug ?? null,
			volume: volume ?? null,
			fuel: fuel ?? null,
			bodyStyle: bodyStyle ?? null,
			transmission: transmission ?? null
		};
	}
}
