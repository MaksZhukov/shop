import { Image, LinkWithImage, SEO } from 'api/types';

export interface PageMain {
	banner?: Image;
	textAfterBrands: string;
	seo: SEO | null;
	discounts?: LinkWithImage[];
	advertising?: LinkWithImage[];
	deliveryAuto?: LinkWithImage;
}
