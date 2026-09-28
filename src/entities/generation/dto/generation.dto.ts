import type { Brand } from 'entities/brand';
import type { Model } from 'entities/model';

export interface GenerationDto {
	id: number;
	name: string;
	slug: string;
}

export type GenerationWithModelAndBrandDto = GenerationDto & {
	model: Model;
	brand: Brand;
};

export type GenerationWithSparePartsCountDto = GenerationDto & {
	spareParts: {
		count: number;
	};
};

export type GenerationWithCabinsCountDto = GenerationDto & {
	cabins: {
		count: number;
	};
};

export type GenerationWithWheelsCountDto = GenerationDto & {
	wheels: {
		count: number;
	};
};
