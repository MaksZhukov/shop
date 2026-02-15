import type { CabinsParsedQueryParams, CabinsQueryParams } from '../types';

export const parseCabinsRouterQuery = (query: unknown): CabinsParsedQueryParams => {
	const {
		sort = 'createdAt:desc',
		page: pageParam = '1',
		kindSparePart: kindSparePartSlug,
		slug
	} = (query || {}) as CabinsQueryParams;

	const page = +pageParam;
	const [brandParamSlug, modelParam, generationParamSlug] = slug || [];
	const model = modelParam ? modelParam.replace('model-', '') : '';

	return {
		sort,
		page,
		brand: brandParamSlug,
		model,
		generation: generationParamSlug,
		kindSparePartSlug
	};
};
