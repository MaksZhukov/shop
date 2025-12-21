import type { Brand } from 'entities/brand/brandTypes';
import type { Generation } from 'entities/generation/generationTypes';
import type { KindSparePart } from 'entities/kindSparePart';
import type { Model } from 'entities/model';
import type { Image, SEO } from 'shared/api/types';
import type { ProductSnippets } from 'entities/product';
import type { Fuel } from 'entities/car';
import type { EngineVolume } from 'entities/engineVolume';

export interface SparePart {
	id: number;
	type: 'sparePart';
	slug: string;
	h1: string;
	name: string;
	volume: EngineVolume;
	description: string;
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
	transmission: string;
	seo?: SEO;
	snippets?: ProductSnippets;
	year: number;
	engine?: string;
	fuel: Fuel;
	engineNumber: string;
	sold: boolean;
	videoLink: string;
}
