import type { Filters } from 'shared/api/types';
import { getParamByRelation } from 'shared/services/ParamsService';
import type { CabinsFilterValues } from '../types';

export const generateCabinsFiltersByQuery = ({
	brand,
	model,
	generation,
	kindSparePart
}: CabinsFilterValues): Filters => {
	return {
		brand: getParamByRelation(brand, 'slug'),
		model: getParamByRelation(model, 'slug'),
		generation: getParamByRelation(generation, 'slug'),
		kindSparePart: getParamByRelation(kindSparePart, 'slug')
	};
};
