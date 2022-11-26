import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { Image, ProductSnippets, SEO } from 'api/types';

export interface Wheel {
	id: number;
	type: 'wheel';
	h1: string;
	name: string;
	slug: string;
	diameter: string;
	numberHoles: number;
	kind: 'литой' | 'штампованный';
	diameterCenterHole: number;
	diskOffset: number;
	distanceBetweenCenters: number;
	width: number;
	height: number;
	brand: Brand;
	model: Model;
	price: number;
	priceUSD: number;
	discountPrice: number;
	discountPriceUSD: number;
	count: number;
	description: string;
	images: Image[];
	seo?: SEO;
	snippets?: ProductSnippets;
}
