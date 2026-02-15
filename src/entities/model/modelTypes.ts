import type { SEO } from 'shared/api/types';
import type {
	GenerationWithCabinsCount,
	GenerationWithSparePartsCount,
	GenerationWithWheelsCount
} from 'entities/generation';
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

export type ModelCabinsCountWithGenerationsCabinsCount = Model & {
	generations: GenerationWithCabinsCount[];
	cabins: {
		count: number;
	};
};

export type ModelWheelsCountWithGenerationsWheelsCount = Model & {
	generations: GenerationWithWheelsCount[];
	wheels: {
		count: number;
	};
};
