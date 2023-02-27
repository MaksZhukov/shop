import { Brand } from 'api/brands/types';
import { Generation } from 'api/generations/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Model } from 'api/models/types';
import { Order } from 'api/orders/types';
import { Image, ProductSnippets, SEO } from 'api/types';

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
    order?: Order;
}
