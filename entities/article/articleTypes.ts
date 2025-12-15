import type { Image, ShortSEO } from 'shared/api/types';

export interface Article {
	id: number;
	name: string;
	slug: string;
	mainImage: Image;
	createdAt: string;
	rightText: string;
	images1: Image[];
	content1: string;
	images2: Image[];
	content2: string;
	seo: ShortSEO;
	content?: string;
}
