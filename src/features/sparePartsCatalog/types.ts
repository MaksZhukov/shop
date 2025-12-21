export interface FilterValues {
	brand: string | null;
	model: string | null;
	generation: string | null;
	kindSparePart: string | null;
	volume: string | null;
	fuel: string | null;
	bodyStyle: string | null;
	transmission: string | null;
	[key: string]: string | null;
}

export type QueryParams = {
	sort: string;
	page: string;
	slug: [string, string, string];
	generation: string;
	kindSparePart: string;
	volume: string;
	fuel: string;
	bodyStyle: string;
	transmission: string;
};

export interface ParsedQueryParams {
	sort: string;
	page: number;
	brand: string | undefined;
	model: string;
	generation: string | undefined;
	kindSparePartSlug: string | undefined;
	volume: string | undefined;
	fuel: string | undefined;
	bodyStyle: string | undefined;
	transmission: string | undefined;
}

