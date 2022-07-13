export interface Model {
	id: number;
	name: string;
}

export interface Model {
	id: number;
	name: string;
}

export interface Brand {
	id: number;
	name: string;
}

export interface SparePart {
	id: number;
	name: string;
}

export interface Product {
	id: number;
	slug: string;
	name: string;
	description: string;
	price: number;
	priceUSD?: number;
	model: Model;
	brand: Brand;
	sparePart: SparePart;
	images?: {
		id: number;
		url: string;
		formats: {
			thumbnail: { url: string };
			small: { url: string };
		};
	}[];
}
