import { Image } from 'api/types';

export interface PageProduct {
	linksWithImages: { id: number; link: string; image: Image }[];
	textAfterDescription: string;
	autoSynonyms: string;
	benefits: Image[];
}
