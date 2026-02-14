import type { SEO } from 'shared/api/types';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';
import { SLUG_PRODUCT_TYPE } from './productConstants';
import type { Product } from './productTypes';
import { isTire } from './productGuards';

export const getProductTypeSlug = (data: Product) => `${SLUG_PRODUCT_TYPE[data.type]}/${data.brand?.slug}`;

/** Product page URL: tires use /tires/{brandSlug}/{slug}, others use /spare-parts/{brandSlug}/{id} */
export const getProductLink = (data: Product): string => {
	if (isTire(data)) {
		return `/tires/${data.brand?.slug ?? ''}/${data.slug}`;
	}
	return `/spare-parts/${data.brand?.slug ?? ''}/${data.id}`;
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
