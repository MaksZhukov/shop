import { Image, SEO } from 'api/types';

export interface Brand {
	id: number;
	name: string;
	image: Image;
	seo: SEO;
	seoSpareParts: SEO;
	seoCabins: SEO;
	seoWheels: SEO;
}
