import { Image, ShortSEO } from 'api/types';

export interface Article {
	id: number;
	name: string;
	slug: string;
	mainImage: Image;
	rightText: string;
	images1: Image[];
	content1: string;
	images2: Image[];
	content2: string;
	seo: ShortSEO;
}
