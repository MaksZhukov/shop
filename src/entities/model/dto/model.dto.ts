import type { SEO } from 'shared/api/types';
import type { Brand } from 'entities/brand';
import type {
	GenerationWithCabinsCount,
	GenerationWithSparePartsCount,
	GenerationWithWheelsCount
} from 'entities/generation';

export interface ModelDto {
	id: number;
	name: string;
	slug: string;
	seoSpareParts: SEO;
	seoWheels: SEO;
	seoCabins: SEO;
	brand?: Brand;
}

export type ModelSparePartsCountDto = ModelDto & {
	spareParts: {
		count: number;
	};
};

export type ModelSparePartsCountWithGenerationsSparePartsCountDto = ModelSparePartsCountDto & {
	generations: GenerationWithSparePartsCount[];
};

export type ModelCabinsCountDto = ModelDto & {
	cabins: {
		count: number;
	};
};

export type ModelCabinsCountWithGenerationsCabinsCountDto = ModelCabinsCountDto & {
	generations: GenerationWithCabinsCount[];
};

export type ModelWheelsCountWithGenerationsWheelsCountDto = ModelDto & {
	generations: GenerationWithWheelsCount[];
	wheels: {
		count: number;
	};
};
