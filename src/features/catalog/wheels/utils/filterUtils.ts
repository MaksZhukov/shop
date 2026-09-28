import type { Filters } from 'shared/api/types';
import { getParamByRelation } from 'shared/services/ParamsService';
import { SLUGIFY_KIND_WHEELS } from 'entities/wheel';
import type { WheelFilterValues } from '../types';

export const generateFiltersByQuery = ({
	kind,
	brand,
	model,
	width,
	diameter,
	numberHoles,
	diameterCenterHole,
	distanceBetweenCenters,
	diskOffset
}: WheelFilterValues): Filters => {
	const filters: Filters = {
		brand: getParamByRelation(brand, 'slug'),
		model: getParamByRelation(model, 'slug'),
		diameter: getParamByRelation(diameter),
		width: getParamByRelation(width),
		numberHoles: getParamByRelation(numberHoles),
		diameterCenterHole: getParamByRelation(diameterCenterHole),
		diskOffset: getParamByRelation(diskOffset),
		kind: kind ? (SLUGIFY_KIND_WHEELS[kind] ?? kind) : undefined
	};
	const distance = distanceBetweenCenters ? Number(distanceBetweenCenters) : undefined;
	if (distance != null && !Number.isNaN(distance)) {
		filters.distanceBetweenCenters = { $eq: distance };
	}
	return filters;
};
