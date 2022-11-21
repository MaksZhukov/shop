import { Brand } from 'api/brands/types';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { Image, ProductSnippets, SEO } from 'api/types';

export interface KindSparePart {
	id: number;
	name: string;
}

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
	model?: Model;
	brand?: Brand;
	generation?: Generation;
	kindSparePart?: SparePart;
	images?: Image[];
	transmission: string;
	seo?: SEO;
	snippets?: ProductSnippets;
}
