import type { Brand } from 'entities/brand';
import type { EngineVolume } from 'entities/engineVolume';
import type { Generation } from 'entities/generation';
import type { Model } from 'entities/model';
import type { Image, SEO } from 'shared/api/types';
import { FUELS } from '../carConstants';

export type Fuel = (typeof FUELS)[number];

export interface Car {
	id: string;
	slug: string;
	fuel: string;
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
	name: string;
	images?: Image[];
	seo?: SEO;
	transmission: string;
}
