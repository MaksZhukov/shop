import type { Image, SEO } from 'shared/api/types';
import type { BrandTextComponent } from 'entities/brand';

export interface TireBrand {
	id: number;
	name: string;
	slug: string;
	image: Image;
	seo: SEO;
	productBrandText?: BrandTextComponent;
}

export type TireBrandWithCount = TireBrand & {
	tires: {
		count: number;
	};
};
