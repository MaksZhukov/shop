import { Brand } from 'api/brands/types';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { Image, SEO } from 'api/types';

export interface Car {
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
	seo?: SEO;
}
