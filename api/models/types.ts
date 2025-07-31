import { SEO } from 'api/types';
import { Generation } from 'api/generations/types';

export interface Model {
	id: number;
	name: string;
	slug: string;
	generations: Generation[];
	seoSpareParts: SEO;
	seoWheels: SEO;
	seoCabins: SEO;
}
