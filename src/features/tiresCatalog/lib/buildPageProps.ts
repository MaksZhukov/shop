import { pageApi } from 'entities/page';
import type { DefaultPage, PageProductTire } from 'entities/page';
import { tireBrandApi } from 'entities/tireBrand';
import { getProductPageSeo } from 'entities/product';
import type { Tire } from 'entities/tire';
import { tireApi } from 'entities/tire';
import { API_DEFAULT_LIMIT } from 'shared/api/constants';
import type { TiresSlugParams } from '../types';

export interface TiresPagePropsResult {
	page: DefaultPage;
	breadcrumbs: Array<{ text: string; href: string }>;
}

export interface TiresProductPagePropsResult {
	data: Tire;
	relatedProducts: Tire[];
	page: DefaultPage;
	breadcrumbs: Array<{ text: string; href: string }>;
}

const ROOT_BREADCRUMBS: Array<{ text: string; href: string }> = [
	{ text: 'Главная', href: '/' },
	{ text: 'Шины', href: '/tires' }
];

export const parseSlugParam = (slug: string[]): TiresSlugParams => {
	const brandSlug = slug[0];
	return { brandSlug };
};

const handleBrandPage = async (brandSlug: string): Promise<TiresPagePropsResult | null> => {
	const {
		data: { data }
	} = await tireBrandApi.fetchTireBrandBySlug(brandSlug, {
		populate: ['image', 'seo']
	});

	if (!data) return null;

	return {
		page: { seo: data.seo },
		breadcrumbs: [...ROOT_BREADCRUMBS, { text: data.name, href: `/tires/${data.slug}` }]
	};
};

const handleDefaultPage = async (): Promise<TiresPagePropsResult> => {
	const {
		data: { data }
	} = await pageApi.fetchPage('tire')();

	return {
		page: { seo: data.seo },
		breadcrumbs: ROOT_BREADCRUMBS
	};
};

export const buildPageProps = async (params: TiresSlugParams): Promise<TiresPagePropsResult | null> => {
	if (params.brandSlug) {
		return await handleBrandPage(params.brandSlug);
	}
	return await handleDefaultPage();
};

export const buildProductPageProps = async (
	brandSlug: string,
	tireSlug: string
): Promise<TiresProductPagePropsResult | null> => {
	let tire: Tire | null = null;
	let pageTire: PageProductTire | null = null;
	try {
		const [tireRes, pageTireRes] = await Promise.all([
			tireApi.fetchTire(tireSlug),
			pageApi.fetchPage<PageProductTire>('product-tire', { populate: ['seo'], fields: ['id'] })()
		]);
		tire = tireRes?.data?.data ?? null;
		pageTire = pageTireRes?.data?.data ?? null;
	} catch {
		return null;
	}

	if (!tire || tire.brand?.slug !== brandSlug) return null;

	let relatedTires: Tire[] = [];
	try {
		const {
			data: { data: related }
		} = await tireApi.fetchTires({
			filters: {
				sold: false,
				id: { $ne: tire.id },
				brand: { id: tire.brand?.id }
			},
			populate: ['brand', 'images'],
			pagination: { limit: API_DEFAULT_LIMIT }
		});
		relatedTires = related ?? [];
	} catch {
		// continue without related products
	}

	const mergedPage: DefaultPage = {
		seo: {
			...(pageTire?.seo ? getProductPageSeo(pageTire.seo, tire) : {}),
			h1: tire.h1 || tire.name
		}
	} as DefaultPage;

	return {
		data: tire,
		relatedProducts: relatedTires,
		page: mergedPage,
		breadcrumbs: [
			...ROOT_BREADCRUMBS,
			{ text: tire.brand?.name ?? '', href: `/tires/${tire.brand?.slug ?? ''}` },
			{ text: tire.name, href: `/tires/${tire.brand?.slug}/${tire.slug}` }
		]
	};
};
