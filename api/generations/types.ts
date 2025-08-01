export interface Generation {
	id: number;
	name: string;
	slug: string;
}

export type GenerationWithSparePartsCount = Generation & {
	spareParts: {
		count: number;
	};
};
