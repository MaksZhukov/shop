import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';

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
