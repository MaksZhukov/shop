import type { TireParsedQueryParams, TireQueryParams } from '../types';

export const parseRouterQuery = (query: unknown): TireParsedQueryParams => {
	const {
		sort = 'createdAt:desc',
		page: pageParam = '1',
		brand: brandQuery,
		width,
		height,
		diameter,
		season,
		slug
	} = (query || {}) as TireQueryParams;

	const page = +pageParam;
	const brand = (Array.isArray(slug) && slug[0] ? slug[0] : brandQuery) || undefined;

	return {
		sort,
		page,
		brand,
		width,
		height,
		diameter,
		season
	};
};
