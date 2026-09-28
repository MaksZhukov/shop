import type { ParsedQueryParams, QueryParams, SlugParams } from '../types';

export const parseSlugParam = (slug: string[]): SlugParams => {
	if (slug.length === 2 && !slug[1].startsWith('model-') && !slug[1].startsWith('ksp-')) {
		return {
			productSlug: slug[1],
			brandParamSlug: slug[0]
		};
	}

	const kindSparePartSlug = slug.find((item) => item.startsWith('ksp-'));
	const modelSlug = slug.find((item) => item.startsWith('model-'));
	const generationSlug = slug.find((item) => item.startsWith('gen-'));

	const brandParamSlug = slug[0] !== kindSparePartSlug ? slug[0] : undefined;

	return {
		brandParamSlug,
		modelSlug: modelSlug ? modelSlug.replace('model-', '') : undefined,
		generationSlug: generationSlug ? generationSlug.replace('gen-', '') : undefined,
		kindSparePartSlug: kindSparePartSlug ? kindSparePartSlug.replace('ksp-', '') : undefined
	};
};

export const parseRouterQuery = (query: unknown): ParsedQueryParams => {
	const {
		sort = 'createdAt:desc',
		page: pageParam = '1',
		volume,
		fuel,
		bodyStyle,
		transmission,
		slug = []
	} = (query || {}) as QueryParams;

	const page = +pageParam;
	const params = parseSlugParam(slug);
	return {
		sort,
		page,
		brand: params.brandParamSlug,
		model: params.modelSlug,
		generation: params.generationSlug,
		kindSparePartSlug: params.kindSparePartSlug,
		volume,
		fuel,
		bodyStyle,
		transmission
	};
};
