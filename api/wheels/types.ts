import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { Image, ProductType } from 'api/types';

export interface Wheel {
	id: number;
	type: 'wheel';
	name: string;
	slug: string;
	diameter: string;
	numberHoles: number;
	kind: 'литой' | 'штампованный';
	diameterCenterHole: number;
	diskOffset: number;
	distanceBetweenCenters: number;
	width: number;
	height: number;
	brand: Brand;
	model: Model;
	price: number;
	priceUSD: number;
	count: number;
	images: Image[];
}
