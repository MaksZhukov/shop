import type { SEO } from 'shared/api/types';
import type { Generation, GenerationWithSparePartsCount } from 'entities/generation/generationTypes';
import type { Brand } from 'entities/brand/brandTypes';

export interface Model {
	id: number;
	name: string;
	slug: string;
	seoSpareParts: SEO;
	seoWheels: SEO;
	seoCabins: SEO;
	brand?: Brand;
}

export type ModelSparePartsCountWithGenerationsSparePartsCount = Model & {
	generations: GenerationWithSparePartsCount[];
	spareParts: {
		count: number;
	};
};
