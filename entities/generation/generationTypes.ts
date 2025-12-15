import type { Brand } from 'entities/brand/brandTypes';
import type { Model } from 'entities/model';

export interface Generation {
	id: number;
	name: string;
	slug: string;
}

export type GenerationWithModelAndBrand = Generation & {
	model: Model;
	brand: Brand;
};

export type GenerationWithSparePartsCount = Generation & {
	spareParts: {
		count: number;
	};
};
