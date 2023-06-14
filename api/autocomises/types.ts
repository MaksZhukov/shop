import { Image, SEO } from 'api/types';

export interface Autocomis {
	id: number;
	name: string;
	image: Image;
	slug: string;
	description: string;
	createdAt: string;
	seo: SEO;
}
