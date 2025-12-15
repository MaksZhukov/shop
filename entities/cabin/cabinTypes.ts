import type { Brand } from 'entities/brand/brandTypes';
import type { Generation } from 'entities/generation/generationTypes';
import type { KindSparePart } from 'entities/kindSparePart';
import type { Model } from 'entities/model';
import type { Order } from 'entities/order';
import type { Image, SEO } from 'shared/api/types';
import type { ProductSnippets } from 'entities/product';

export interface Cabin {
	id: number;
	type: 'cabin';
	slug: string;
	h1: string;
	name: string;
	description: string;
	seatUpholstery: string;
	price: number;
	priceUSD?: number;
	priceRUB: number;
	discountPrice: number;
	discountPriceUSD: number;
	model?: Model;
	brand?: Brand;
	generation?: Generation;
	kindSparePart?: KindSparePart;
	images?: Image[];
	seo?: SEO;
	snippets: ProductSnippets;
	year: string;
	sold: boolean;
}
