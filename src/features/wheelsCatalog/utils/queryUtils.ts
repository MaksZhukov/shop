import type { WheelParsedQueryParams, WheelQueryParams } from '../types';

export const parseRouterQuery = (query: unknown): WheelParsedQueryParams => {
	const {
		sort = 'createdAt:desc',
		page: pageParam = '1',
		kind,
		brand: brandQuery,
		model,
		width,
		diameter,
		numberHoles,
		diameterCenterHole,
		distanceBetweenCenters,
		diskOffset,
		slug
	} = (query || {}) as WheelQueryParams;

	const page = +pageParam;
	const brand = (Array.isArray(slug) && slug[0] ? slug[0] : brandQuery) || undefined;
	const modelParam = Array.isArray(slug) && slug[1] ? slug[1] : undefined;
	const modelFromSlug = modelParam?.startsWith('model-') ? modelParam.replace('model-', '') : undefined;
	const modelResolved = modelFromSlug ?? model;

	return {
		sort,
		page,
		kind,
		brand,
		model: modelResolved,
		width,
		diameter,
		numberHoles,
		diameterCenterHole,
		distanceBetweenCenters,
		diskOffset
	};
};
