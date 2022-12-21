import { Brand } from 'api/brands/types';
import { Generation } from 'api/generations/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Model } from 'api/models/types';
import { Image, ProductSnippets, SEO } from 'api/types';

export interface SparePart {
	id: number;
	type: 'sparePart';
	slug: string;
	h1: string;
	name: string;
	volume: number;
	description: string;
	price: number;
	priceUSD?: number;
	discountPrice: number;
	discountPriceUSD: number;
	model?: Model;
	brand?: Brand;
	generation?: Generation;
	kindSparePart?: KindSparePart;
	images?: Image[];
	transmission: string;
	seo?: SEO;
	snippets?: ProductSnippets;
	year: number;
	engine?: string;
}
