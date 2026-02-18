import type { SEO } from 'shared/api/types';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';
import { SLUG_PRODUCT_TYPE } from './productConstants';
import type { Product } from './productTypes';
import { isTire, isWheel, isCabin, isSparePart } from './productGuards';

export const getProductTypeSlug = (data: Product) => `${SLUG_PRODUCT_TYPE[data.type]}/${data.brand?.slug}`;

/** Product page URL: tires /tires/{brandSlug}/{slug}, wheels /wheels/{brandSlug}/{slug}, cabins /cabins/{brandSlug}/{slug}, others /spare-parts/{brandSlug}/{id} */
export const getProductLink = (data: Product): string => {
	if (isTire(data)) {
		return `/tires/${data.brand?.slug ?? ''}/${data.slug}`;
	}
	if (isWheel(data)) {
		return `/wheels/${data.brand?.slug ?? ''}/${data.slug}`;
	}
	if (isCabin(data)) {
		return `/cabins/${data.brand?.slug ?? ''}/${data.slug}`;
	}
	return `/spare-parts/${data.brand?.slug ?? ''}/${data.slug}`;
};

export const getProductDetails = (product: Product): string => {
	if (isSparePart(product)) {
		return [product.volume?.name, product.fuel, product.transmission, product.year].filter(Boolean).join(', ');
	}
	if (isTire(product)) {
		return [product.width?.name, product.height?.name, product.diameter?.name, product.season]
			.filter(Boolean)
			.join(', ');
	}
	if (isWheel(product)) {
		return [product.diameter?.name, product.width?.name, product.kind].filter(Boolean).join(', ');
	}
	if (isCabin(product)) {
		return [product.brand?.name, product.model?.name, product.year].filter(Boolean).join(', ');
	}
	return '';
};

export const getProductPageSeo = (pageSeo: SEO, product: Product) => {
	return {
		title: product.seo?.title || getStringByTemplateStr(pageSeo.title, product),
		description: `Стоимость ${product.discountPrice || product.price} руб ${
			product.seo?.description || getStringByTemplateStr(pageSeo.description, product)
		}`,
		keywords: product.seo?.keywords || getStringByTemplateStr(pageSeo.keywords, product)
	};
};
