import { Filters } from 'shared/api/types';
import { getParamByRelation } from 'shared/services/ParamsService';
import { SLUGIFY_BODY_STYLES, SLUGIFY_FUELS, SLUGIFY_TRANSMISSIONS } from 'entities/car';
import { FilterValues } from '../types';

export const generateFiltersByQuery = ({
	brand,
	model,
	generation,
	kindSparePart,
	volume,
	fuel,
	bodyStyle,
	transmission
}: FilterValues): Filters => {
	return {
		brand: getParamByRelation(brand, 'slug'),
		model: getParamByRelation(model, 'slug'),
		generation: getParamByRelation(generation, 'slug'),
		kindSparePart: getParamByRelation(kindSparePart, 'slug'),
		volume: getParamByRelation(volume),
		fuel: fuel ? SLUGIFY_FUELS[fuel] : null,
		bodyStyle: bodyStyle ? SLUGIFY_BODY_STYLES[bodyStyle] : null,
		transmission: transmission ? SLUGIFY_TRANSMISSIONS[transmission] : null
	};
};

