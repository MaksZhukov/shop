export interface CabinsFilterValues {
	brand: string | null;
	model: string | null;
	generation: string | null;
	kindSparePart: string | null;
	[key: string]: string | null;
}

export type CabinsQueryParams = {
	sort?: string;
	page?: string;
	slug?: string[];
	kindSparePart?: string;
};

export interface CabinsParsedQueryParams {
	sort: string;
	page: number;
	brand: string | undefined;
	model: string;
	generation: string | undefined;
	kindSparePartSlug: string | undefined;
}
