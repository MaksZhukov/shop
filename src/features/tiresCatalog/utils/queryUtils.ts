import type { TireParsedQueryParams, TireQueryParams } from '../types';

export const parseRouterQuery = (query: unknown): TireParsedQueryParams => {
	const {
		sort = 'createdAt:desc',
		page: pageParam = '1',
		brand,
		width,
		height,
		diameter,
		season
	} = (query || {}) as TireQueryParams;

	const page = +pageParam;

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
