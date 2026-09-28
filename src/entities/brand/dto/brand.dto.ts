import type { Image, SEO } from 'shared/api/types';

export interface BrandTextComponentDto {
	content: string;
}

export type ProductBrandTextsDto = {
	sparePartBrandText?: BrandTextComponentDto;
	cabinTextBrand?: BrandTextComponentDto;
	wheelTextBrand?: BrandTextComponentDto;
};

export interface BrandDto {
	id: number;
	name: string;
	image: Image;
	slug: string;
	seo: SEO;
	seoSpareParts: SEO;
	seoCabins: SEO;
	seoWheels: SEO;
	productBrandTexts?: ProductBrandTextsDto;
}

export type BrandWithSparePartsCountDto = BrandDto & {
	spareParts: {
		count: number;
	};
};

export type BrandWithCabinsCountDto = BrandDto & {
	cabins: {
		count: number;
	};
};

export type BrandWithWheelsCountDto = BrandDto & {
	wheels: {
		count: number;
	};
};
