import { Brand } from 'api/brands/types';
import { SparePart } from 'api/spareParts/types';
import { TireBrand } from 'api/tireBrands/types';
import { Tire } from 'api/tires/types';
import { Product, SEO } from 'api/types';
import { Wheel } from 'api/wheels/types';
import { getStringByTemplateStr } from './StringService';

let SLUG_PRODUCT_TYPE = {
	sparePart: 'spare-parts',
	wheel: 'wheels',
	cabin: 'cabins',
	tire: 'tires'
};

const getPriceWithSale = (price: number) => (price <= 500 ? price * 0.9 : 0.95);

export const isTire = (data: Product): data is Tire => data.type === 'tire';
export const isSparePart = (data: Product): data is SparePart => data.type === 'sparePart';
//@ts-expect-error error
export const isTireBrand = (data: TireBrand | Brand | undefined): data is TireBrand => data.productBrandText;
export const isWheel = (data: Product): data is Wheel => data.type === 'wheel';
export const getProductTypeSlug = (data: Product) => `${SLUG_PRODUCT_TYPE[data.type]}/${data.brand?.slug}`;
export const getProductPageSeo = (pageSeo: SEO, product: Product) => {
	return {
		title: product.seo?.title || getStringByTemplateStr(pageSeo.title, product),
		description: `Стоимость ${product.discountPrice || product.price} руб ${
			product.seo?.description || getStringByTemplateStr(pageSeo.description, product)
		}`,
		keywords: product.seo?.keywords || getStringByTemplateStr(pageSeo.keywords, product)
	};
};
