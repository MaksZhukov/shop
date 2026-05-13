import type { BrandsDataFilters } from './sparePartsPageQueries';

export const ERROR_MESSAGES = {
	AUTOCOMPLETE_LOAD_ERROR:
		'Произошла какая-то ошибка при загрузке данных для автозаполнения, попробуйте снова или обратитесь в поддержку',
	AUTOCOMPLETE_FETCH_ERROR: 'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку'
} as const;

export const sparePartsBrandsQueryKey = (filters: BrandsDataFilters = {}) =>
	[
		'spare-parts-brands',
		filters.kindSparePart ?? '',
		filters.model ?? '',
		filters.generation ?? '',
		filters.volume ?? '',
		filters.fuel ?? '',
		filters.bodyStyle ?? '',
		filters.transmission ?? ''
	] as const;
