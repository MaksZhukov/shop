export interface TireFilterValues {
	brand: string | null;
	width: string | null;
	height: string | null;
	diameter: string | null;
	season: string | null;
	[key: string]: string | null;
}

export type TireQueryParams = {
	sort: string;
	page: string;
	brand: string;
	width: string;
	height: string;
	diameter: string;
	season: string;
};

export interface TireParsedQueryParams {
	sort: string;
	page: number;
	brand: string | undefined;
	width: string | undefined;
	height: string | undefined;
	diameter: string | undefined;
	season: string | undefined;
}
