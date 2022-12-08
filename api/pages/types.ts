import { Image, LinkWithImage, SEO } from 'api/types';

export type DefaultPage = {
	seo: SEO;
};

export type PageMain = {
	banner?: Image;
	textAfterBrands: string;
	seo: SEO | null;
	discounts?: LinkWithImage[];
	advertising?: LinkWithImage[];
	deliveryAuto?: LinkWithImage;
};

export type PageProduct = {
	linksWithImages: LinkWithImage[];
	textAfterDescription: string;
	autoSynonyms: string;
	benefits: Image[];
	title: string;
	description: string;
};
