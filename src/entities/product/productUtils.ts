import { SEO } from 'shared/api/types';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';
import { SLUG_PRODUCT_TYPE } from './productConstants';
import { Product } from './productTypes';

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
