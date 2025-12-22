import type { ParsedQueryParams, QueryParams } from '../types';

export const parseRouterQuery = (query: unknown): ParsedQueryParams => {
	const {
		sort = 'createdAt:desc',
		page: pageParam = '1',
		kindSparePart: kindSparePartSlug,
		volume,
		fuel,
		bodyStyle,
		transmission,
		slug
	} = (query || {}) as QueryParams;

	const page = +pageParam;
	const [brandParamSlug, modelParam, generationParamSlug] = slug || [];
	const model = modelParam ? modelParam.replace('model-', '') : '';

	return {
		sort,
		page,
		brand: brandParamSlug,
		model,
		generation: generationParamSlug,
		kindSparePartSlug,
		volume,
		fuel,
		bodyStyle,
		transmission
	};
};

