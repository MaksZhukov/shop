import type { CabinsParsedQueryParams, CabinsQueryParams, SlugParams } from '../types';

export const parseSlugParam = (slug: string[]): SlugParams => {
	const kindSparePartSegment = slug.find((item) => item.startsWith('ksp-'));
	const kindSparePartSlug = kindSparePartSegment ? kindSparePartSegment.replace('ksp-', '') : undefined;

	const segmentsWithoutKsp = slug.filter((s) => !s.startsWith('ksp-'));
	const [brandParamSlug, modelOrProductParamSlug, generationParamSlug] = segmentsWithoutKsp;

	const productSlug =
		modelOrProductParamSlug && !modelOrProductParamSlug.includes('model-') ? modelOrProductParamSlug : undefined;

	const modelSlug =
		modelOrProductParamSlug && modelOrProductParamSlug.includes('model-')
			? modelOrProductParamSlug.replace('model-', '')
			: undefined;

	return {
		brandParamSlug,
		modelSlug,
		generationParamSlug,
		productSlug,
		kindSparePartSlug
	};
};

export const parseCabinsRouterQuery = (query: unknown): CabinsParsedQueryParams => {
	const { sort = 'createdAt:desc', page: pageParam = '1', slug } = (query || {}) as CabinsQueryParams;

	const page = +pageParam;
	const params = parseSlugParam(slug || []);
	const model = params.modelSlug ?? '';

	return {
		sort,
		page,
		brand: params.brandParamSlug,
		model,
		generation: params.generationParamSlug,
		kindSparePartSlug: params.kindSparePartSlug
	};
};
