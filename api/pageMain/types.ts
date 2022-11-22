import { Image, LinkWithImage, SEO } from 'api/types';

export interface PageMain {
	autocomises?: LinkWithImage[];
	banner: Image;
	textAfterBrands: string;
	seo?: SEO;
	discounts?: LinkWithImage[];
	advertising?: LinkWithImage[];
	deliveryAuto?: LinkWithImage;
}
