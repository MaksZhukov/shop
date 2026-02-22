export const ERROR_MESSAGES = {
	AUTOCOMPLETE_LOAD_ERROR: 'Ошибка загрузки данных',
	AUTOCOMPLETE_FETCH_ERROR: 'Ошибка загрузки данных'
} as const;

export const cabinsBrandsQueryKey = (kindSparePartSlug?: string | null) =>
	['cabins-brands', kindSparePartSlug ?? ''] as const;
