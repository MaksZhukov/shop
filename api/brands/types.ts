import { BrandTextComponent, Image, SEO } from 'api/types';

export type ProductBrandTexts = {
	sparePartBrandText?: BrandTextComponent;
	cabinTextBrand?: BrandTextComponent;
	wheelTextBrand?: BrandTextComponent;
};

export interface Brand {
	id: number;
	name: string;
	image: Image;
	slug: string;
	seo: SEO;
	seoSpareParts: SEO;
	seoCabins: SEO;
	seoWheels: SEO;
	productBrandTexts?: ProductBrandTexts;
}

export type BrandWithSparePartsCount = Brand & {
	spareParts: {
		count: number;
	};
};
