import type { SEO } from 'shared/api/types';
import type {
	GenerationWithCabinsCount,
	GenerationWithSparePartsCount,
	GenerationWithWheelsCount
} from 'entities/generation';
import type { Brand } from 'entities/brand';

export interface Model {
	id: number;
	name: string;
	slug: string;
	seoSpareParts: SEO;
	seoWheels: SEO;
	seoCabins: SEO;
	brand?: Brand;
}

export type ModelSparePartsCount = Model & {
	spareParts: {
		count: number;
	};
};

export type ModelSparePartsCountWithGenerationsSparePartsCount = ModelSparePartsCount & {
	generations: GenerationWithSparePartsCount[];
};

export type ModelCabinsCount = Model & {
	cabins: {
		count: number;
	};
};

export type ModelCabinsCountWithGenerationsCabinsCount = ModelCabinsCount & {
	generations: GenerationWithCabinsCount[];
};

export type ModelWheelsCountWithGenerationsWheelsCount = Model & {
	generations: GenerationWithWheelsCount[];
	wheels: {
		count: number;
	};
};
