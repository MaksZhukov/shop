import { Brand } from 'api/brands/types';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { Image, SEO } from 'api/types';

export interface CarOnParts {
	id: string;
	slug: string;
	fuel: string;
	mileage: number;
	volume: number;
	deliveryDate: Date;
	manufactureDate: Date;
	bodyStyle: string;
	engine: string;
	videoLink: string;
	generation?: Generation;
	model?: Model;
	brand?: Brand;
	images?: Image[];
	price: number;
	priceUSD: number;
	seo?: SEO;
	description: string;
}
