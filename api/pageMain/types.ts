import { Image, LinkWithImage, SEO } from 'api/types';

export interface PageMain {
	autocomises?: LinkWithImage[];
	banner?: Image;
	textAfterBrands: string;
	seo: SEO | null;
	discounts?: LinkWithImage[];
	advertising?: LinkWithImage[];
	serviceStations?: LinkWithImage[];
	deliveryAuto?: LinkWithImage;
}
