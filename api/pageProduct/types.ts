import { Image, SEO } from 'api/types';

export interface PageProduct {
	linksWithImages: { id: number; link: string; image: Image }[];
}
