import { BrandTextComponent, Image, SEO } from 'api/types';

export interface TireBrand {
	id: number;
	name: string;
	slug: string;
    image: Image;
	seo: SEO;
	productBrandText?: BrandTextComponent;
}
