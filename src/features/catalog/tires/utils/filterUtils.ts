import type { Filters } from 'shared/api/types';
import { getParamByRelation } from 'shared/services/ParamsService';
import { SLUGIFY_SEASONS } from 'entities/tire';
import type { TireFilterValues } from '../types';

export const generateFiltersByQuery = ({
	brand,
	width,
	height,
	diameter,
	season
}: TireFilterValues): Filters => {
	return {
		brand: getParamByRelation(brand, 'slug'),
		width: getParamByRelation(width),
		height: getParamByRelation(height),
		diameter: getParamByRelation(diameter),
		season: season ? SLUGIFY_SEASONS[season] ?? null : null
	};
};
