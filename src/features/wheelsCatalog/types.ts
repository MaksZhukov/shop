export interface WheelFilterValues {
	kind: string | null;
	brand: string | null;
	model: string | null;
	width: string | null;
	diameter: string | null;
	numberHoles: string | null;
	diameterCenterHole: string | null;
	distanceBetweenCenters: string | null;
	diskOffset: string | null;
	[key: string]: string | null;
}

export type WheelQueryParams = {
	sort?: string;
	page?: string;
	kind?: string;
	brand?: string;
	model?: string;
	width?: string;
	diameter?: string;
	numberHoles?: string;
	diameterCenterHole?: string;
	distanceBetweenCenters?: string;
	diskOffset?: string;
	slug?: string[];
};

export interface WheelParsedQueryParams {
	sort: string;
	page: number;
	kind: string | undefined;
	brand: string | undefined;
	model: string | undefined;
	width: string | undefined;
	diameter: string | undefined;
	numberHoles: string | undefined;
	diameterCenterHole: string | undefined;
	distanceBetweenCenters: string | undefined;
	diskOffset: string | undefined;
}
