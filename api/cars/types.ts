import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { Image } from 'api/types';

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
	generation: string;
	model?: Model;
	brand?: Brand;
	images?: Image[];
}
