import { Image, SEO } from 'api/types';

export interface ServiceStation {
	id: number;
	name: string;
	image: Image;
	slug: string;
	description: string;
	seo: SEO;
}
