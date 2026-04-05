import type { Image, SEO } from 'shared/api/types';

export interface BrandTextComponent {
	content: string;
}

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

export type BrandWithCabinsCount = Brand & {
	cabins: {
		count: number;
	};
};

export type BrandWithWheelsCount = Brand & {
	wheels: {
		count: number;
	};
};
