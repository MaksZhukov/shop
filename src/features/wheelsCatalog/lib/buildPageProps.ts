import { brandApi } from 'entities/brand';
import { modelApi } from 'entities/model';
import { pageApi } from 'entities/page';
import type { DefaultPage, PageProductWheel } from 'entities/page';
import { getProductPageSeo } from 'entities/product';
import type { Wheel } from 'entities/wheel';
import { wheelApi } from 'entities/wheel';
import { API_DEFAULT_LIMIT } from 'shared/api/constants';
import type { WheelsSlugParams } from '../types';

export interface WheelsPagePropsResult {
	page: DefaultPage;
	breadcrumbs: Array<{ text: string; href: string }>;
	data?: Wheel;
	relatedProducts?: Wheel[];
}

const ROOT_BREADCRUMBS: Array<{ text: string; href: string }> = [
	{ text: 'Главная', href: '/' },
	{ text: 'Диски', href: '/wheels' }
];

export const parseSlugParam = (slug: string[]): WheelsSlugParams => {
	const [brandParamSlug, modelOrProductParamSlug] = slug;
	const productSlug =
		modelOrProductParamSlug && !modelOrProductParamSlug.startsWith('model-') ? modelOrProductParamSlug : undefined;
	const modelSlug = modelOrProductParamSlug?.startsWith('model-')
		? modelOrProductParamSlug.replace('model-', '')
		: undefined;
	return { brandParamSlug, modelSlug, productSlug };
};

const handleProductPage = async (brandParamSlug: string, productSlug: string): Promise<WheelsPagePropsResult | null> => {
	const [
		{
			data: { data: wheel }
		},
		{
			data: { data: pageWheel }
		}
	] = await Promise.all([
		wheelApi.fetchWheel(productSlug),
		pageApi.fetchPage<PageProductWheel>('product-wheel', { populate: ['seo'], fields: ['id'] })()
	]);

	if (!wheel || wheel.brand?.slug !== brandParamSlug) return null;

	const {
		data: { data: relatedWheels }
	} = await wheelApi.fetchWheels({
		filters: {
			sold: false,
			id: { $ne: wheel.id },
			brand: { id: wheel.brand?.id }
		},
		populate: ['brand', 'images', 'model'],
		pagination: { limit: API_DEFAULT_LIMIT }
	});

	const mergedPage: DefaultPage = {
		seo: {
			...(pageWheel?.seo ? getProductPageSeo(pageWheel.seo, wheel) : {}),
			h1: wheel.h1 || wheel.name
		}
	} as DefaultPage;

	return {
		data: wheel,
		relatedProducts: relatedWheels ?? [],
		page: mergedPage,
		breadcrumbs: [
			...ROOT_BREADCRUMBS,
			{ text: wheel.brand?.name ?? '', href: `/wheels/${wheel.brand?.slug}` },
			{ text: wheel.name, href: `/wheels/${wheel.brand?.slug}/${wheel.slug}` }
		]
	};
};

const handleModelPage = async (brandParamSlug: string, modelSlug: string): Promise<WheelsPagePropsResult | null> => {
	const {
		data: { data }
	} = await modelApi.fetchModelBySlug(modelSlug, {
		populate: ['seoWheels', 'brand'],
		filters: { brand: { slug: brandParamSlug } }
	});

	if (!data) return null;

	return {
		page: { seo: data.seoWheels },
		breadcrumbs: [
			...ROOT_BREADCRUMBS,
			{ text: data.brand?.name ?? '', href: `/wheels/${data.brand?.slug}` },
			{ text: data.name, href: `/wheels/${data.brand?.slug}/model-${data.slug}` }
		]
	};
};

const handleBrandPage = async (brandParamSlug: string): Promise<WheelsPagePropsResult | null> => {
	const {
		data: { data }
	} = await brandApi.fetchBrandBySlug(brandParamSlug, {
		populate: ['seoWheels']
	});

	if (!data) return null;

	return {
		page: { seo: data.seoWheels },
		breadcrumbs: [...ROOT_BREADCRUMBS, { text: data.name, href: `/wheels/${data.slug}` }]
	};
};

const handleDefaultPage = async (): Promise<WheelsPagePropsResult> => {
	const {
		data: { data }
	} = await pageApi.fetchPage('wheel')();

	return {
		page: { seo: data.seo },
		breadcrumbs: ROOT_BREADCRUMBS
	};
};

export const buildPageProps = async (params: WheelsSlugParams): Promise<WheelsPagePropsResult | null> => {
	const { brandParamSlug, modelSlug, productSlug } = params;

	if (productSlug && brandParamSlug) {
		return await handleProductPage(brandParamSlug, productSlug);
	}

	if (modelSlug && brandParamSlug) {
		return await handleModelPage(brandParamSlug, modelSlug);
	}

	if (brandParamSlug) {
		return await handleBrandPage(brandParamSlug);
	}

	return await handleDefaultPage();
};
