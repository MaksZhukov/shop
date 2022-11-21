import { TireBrand } from 'api/tireBrands/types';
import { Image, ProductSnippets, SEO } from 'api/types';

export type Season = 'зимние' | 'летние' | 'всесезонные';

export interface Tire {
	id: number;
	type: 'tire';
	h1: string;
	name: string;
	slug: string;
	diameter: string;
	width: number;
	height: number;
	season: Season;
	brand: TireBrand;
	price: number;
	priceUSD: number;
	count: number;
	description: string;
	images: Image[];
	seo?: SEO;
	snippets?: ProductSnippets;
}
