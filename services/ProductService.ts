import { SparePart } from 'api/spareParts/types';
import { Tire } from 'api/tires/types';
import { Product, SEO } from 'api/types';
import { Wheel } from 'api/wheels/types';

let SLUG_PRODUCT_TYPE = {
	sparePart: 'spare-parts',
	wheel: 'wheels',
	cabin: 'cabins',
	tire: 'tires',
};

const getStringByTemplateStr = (value: string, data: Product) => {
	let newValue = value;
	for (let result of value.matchAll(/{(\w+)}/g)) {
		let field = result[1] as keyof Product;
		//@ts-expect-error error
		newValue = newValue.replace(result[0], typeof data[field] === 'string' ? data[field] : data[field]?.name);
	}
	return newValue;
};

export const isTire = (data: Product): data is Tire => data.type === 'tire';
export const isWheel = (data: Product): data is Wheel => data.type === 'wheel';
export const getProductTypeSlug = (data: Product) => `${SLUG_PRODUCT_TYPE[data.type]}/${data.brand?.slug}`;
export const getProductPageSeo = (pageSeo: SEO, product: Product) => {
	return {
		title: product.seo?.title || getStringByTemplateStr(pageSeo.title, product),
		description: product.seo?.description || getStringByTemplateStr(pageSeo.description, product),
		keywords: product.seo?.keywords || getStringByTemplateStr(pageSeo.keywords, product),
	};
};
