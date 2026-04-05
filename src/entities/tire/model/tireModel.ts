import type { Order } from 'entities/order';
import type { TireBrand } from 'entities/tireBrand';
import type { TireDiameter } from 'entities/tireDiameter';
import type { TireHeight } from 'entities/tireHeight';
import type { TireWidth } from 'entities/tireWidth';
import type { Image, SEO } from 'shared/api/types';
import type { ProductSnippets } from 'entities/product';

export type Season = 'зимние' | 'летние' | 'всесезонные';

export interface Tire {
	id: number;
	type: 'tire';
	h1: string;
	name: string;
	slug: string;
	diameter: TireDiameter;
	width: TireWidth;
	height: TireHeight;
	season: Season;
	brand: TireBrand;
	price: number;
	priceUSD: number;
	priceRUB: number;
	discountPrice: number;
	discountPriceUSD: number;
	count: number;
	description: string;
	images: Image[];
	seo?: SEO;
	snippets?: ProductSnippets;
	sold: boolean;
}
