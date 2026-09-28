import type { Brand } from 'entities/brand';
import type { EngineVolume } from 'entities/engineVolume';
import type { Generation } from 'entities/generation';
import type { Model } from 'entities/model';
import type { Image, SEO } from 'shared/api/types';

export interface CarOnParts {
	id: string;
	slug: string;
	fuel: string;
	name: string;
	mileage: number;
	volume: EngineVolume;
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
	transmission: string;
}
