import type { Brand } from 'entities/brand';
import type { Model } from 'entities/model';
import type { Order } from 'entities/order';
import type { Image, SEO } from 'shared/api/types';
import type { ProductSnippets } from 'entities/product';
import type { WheelDiameterCenterHole } from 'entities/wheelDiameterCenterHole';
import type { WheelDiameter } from 'entities/wheelDiameter';
import type { WheelDiskOffset } from 'entities/wheelDiskOffset';
import type { WheelNumberHole } from 'entities/wheelNumberHole';
import type { WheelWidth } from 'entities/wheelWidth';

export interface Wheel {
	id: number;
	type: 'wheel';
	h1: string;
	name: string;
	slug: string;
	diameter: WheelDiameter;
	numberHoles: WheelNumberHole;
	kind: 'литой' | 'штампованный';
	diameterCenterHole: WheelDiameterCenterHole;
	diskOffset: WheelDiskOffset;
	distanceBetweenCenters: number;
	width: WheelWidth;
	height: number;
	brand: Brand;
	model: Model;
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
