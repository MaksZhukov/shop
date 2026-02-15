export type BrandCatalog = {
	id: number;
	name: string;
	slug: string;
	path: string;
	count: number;
};

export type GenerationCatalog = {
	id: number;
	name: string;
	slug: string;
	path: string;
	count: number;
};

export type ModelCatalog = {
	id: number;
	name: string;
	slug: string;
	path: string;
	count: number;
	generations?: GenerationCatalog[];
};
