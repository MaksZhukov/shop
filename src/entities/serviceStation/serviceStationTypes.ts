import type { Image, SEO } from 'shared/api/types';

export interface ServiceStation {
	id: number;
	name: string;
	image: Image;
	slug: string;
	description: string;
	createdAt: string;
	seo: SEO;
}
