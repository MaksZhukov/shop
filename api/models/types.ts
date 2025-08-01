import { SEO } from 'api/types';
import { Generation, GenerationWithSparePartsCount } from 'api/generations/types';

export interface Model {
	id: number;
	name: string;
	slug: string;
	seoSpareParts: SEO;
	seoWheels: SEO;
	seoCabins: SEO;
}

export type ModelSparePartsCountWithGenerationsSparePartsCount = Model & {
	generations: GenerationWithSparePartsCount[];
	spareParts: {
		count: number;
	};
};
