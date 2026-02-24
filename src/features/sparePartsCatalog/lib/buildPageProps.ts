import { brandApi } from 'entities/brand';
import { generationApi } from 'entities/generation';
import type { GenerationWithModelAndBrand } from 'entities/generation/generationTypes';
import { withGeneration } from 'entities/generation';
import { kindSparePartApi } from 'entities/kindSparePart';
import type { KindSparePart } from 'entities/kindSparePart';
import { withKindSparePart } from 'entities/kindSparePart';
import { modelApi } from 'entities/model';
import { pageApi } from 'entities/page';
import type { DefaultPage, PageProduct, PageProductSparePart } from 'entities/page';
import { sparePartApi } from 'entities/sparePart';
import type { SparePart } from 'entities/sparePart';
import { getProductPageSeo } from 'entities/product';
import type { SlugParams } from '../types';

export interface SparePartsPagePropsResult {
	data?: SparePart;
	relatedProducts?: SparePart[];
	page?: DefaultPage & Record<string, unknown>;
	breadcrumbs?: Array<{ text: string; href: string }>;
	kindSparePart?: KindSparePart;
	generation?: { id: number; name: string; slug: string };
}

type BreadcrumbItem = { text: string; href: string };

const ROOT_BREADCRUMBS: BreadcrumbItem[] = [
	{ text: 'Главная', href: '/' },
	{ text: 'Запчасти', href: '/spare-parts' }
];

const withKindSparePartBreadcrumb = (
	base: BreadcrumbItem[],
	kindSparePart: KindSparePart | undefined,
	basePath: string
): BreadcrumbItem[] =>
	kindSparePart ? [...base, { text: kindSparePart.name, href: `${basePath}/ksp-${kindSparePart.slug}` }] : base;

const withOptionalKindSparePart = (result: SparePartsPagePropsResult, kindSparePart?: KindSparePart) =>
	kindSparePart ? { ...result, kindSparePart } : result;

const fetchKindSparePartIfNeeded = async (kindSparePartSlug?: string): Promise<KindSparePart | undefined> => {
	if (!kindSparePartSlug) return undefined;
	const result = await kindSparePartApi.fetchKindSpareParts({
		filters: { slug: kindSparePartSlug, type: 'regular' }
	});
	return result?.data?.data[0];
};

const handleProductPage = async (productSlug: string): Promise<SparePartsPagePropsResult> => {
	const [
		{
			data: { data }
		},
		{
			data: { data: pageSparePart }
		}
	] = await Promise.all([
		sparePartApi.fetchSparePart(productSlug),
		pageApi.fetchPage<PageProductSparePart>('product-spare-part', { populate: ['seo'], fields: ['id'] })()
	]);

	const {
		data: { data: relatedProducts }
	} = await sparePartApi.fetchSpareParts({
		filters: { sold: false, id: { $ne: data.id }, model: data.model?.id || '' },
		populate: ['images', 'brand']
	});

	const brandSlug = data.brand?.slug ?? '';
	const brandPath = `/spare-parts/${brandSlug}`;

	return {
		data,
		relatedProducts,
		page: {
			seo: {
				...getProductPageSeo(pageSparePart.seo, data),
				h1: data.h1 || data.name
			}
		},
		breadcrumbs: [
			...ROOT_BREADCRUMBS,
			{ text: data.brand?.name ?? '', href: brandPath },
			{ text: data.name, href: `${brandPath}/${data.slug}` }
		]
	};
};

const handleGenerationPage = async (
	brandParamSlug: string,
	modelSlug: string,
	generationParamSlug: string,
	kindSparePartSlug?: string
): Promise<SparePartsPagePropsResult> => {
	const [
		{
			data: { data: generations }
		}
	] = await Promise.all([
		generationApi.fetchGeneration<GenerationWithModelAndBrand>({
			filters: { slug: generationParamSlug, model: { slug: modelSlug }, brand: { slug: brandParamSlug } },
			populate: ['model.seoSpareParts', 'brand']
		})
	]);

	const generation = generations?.[0];
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	const basePath = `/spare-parts/${generation.brand?.slug}/model-${generation.model.slug}/gen-${generation.slug}`;
	const breadcrumbs = withKindSparePartBreadcrumb(
		[
			...ROOT_BREADCRUMBS,
			{ text: generation.brand.name, href: `/spare-parts/${generation.brand?.slug}` },
			{
				text: generation.model.name,
				href: `/spare-parts/${generation.brand?.slug}/model-${generation.model.slug}`
			},
			{ text: generation.name, href: basePath }
		],
		kindSparePart,
		basePath
	);

	return withOptionalKindSparePart(
		{
			generation: { id: generation.id, name: generation.name, slug: generation.slug },
			page: {
				seo: withKindSparePart(
					withGeneration(
						generation.model.seoSpareParts,
						`${generation.brand.name} ${generation.model.name}`,
						generation.name
					),
					'запчасти',
					kindSparePart?.name
				)
			},
			breadcrumbs
		},
		kindSparePart
	);
};

const handleModelPage = async (
	brandParamSlug: string,
	modelSlug: string,
	kindSparePartSlug?: string
): Promise<SparePartsPagePropsResult> => {
	const {
		data: { data }
	} = await modelApi.fetchModelBySlug(modelSlug, {
		populate: ['seoSpareParts.images', 'brand'],
		filters: { brand: { slug: brandParamSlug } }
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);
	const basePath = `/spare-parts/${data.brand?.slug ?? ''}/model-${data.slug}`;

	return withOptionalKindSparePart(
		{
			page: { seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name) },
			breadcrumbs: withKindSparePartBreadcrumb(
				[
					...ROOT_BREADCRUMBS,
					{ text: data.brand?.name ?? '', href: `/spare-parts/${data.brand?.slug ?? ''}` },
					{ text: data.name, href: basePath }
				],
				kindSparePart,
				basePath
			)
		},
		kindSparePart
	);
};

const handleBrandPage = async (
	brandParamSlug: string,
	kindSparePartSlug?: string
): Promise<SparePartsPagePropsResult> => {
	const {
		data: { data }
	} = await brandApi.fetchBrandBySlug(brandParamSlug, {
		populate: ['seoSpareParts.images']
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);
	const basePath = `/spare-parts/${data.slug}`;

	return withOptionalKindSparePart(
		{
			page: { seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name) },
			breadcrumbs: withKindSparePartBreadcrumb(
				[...ROOT_BREADCRUMBS, { text: data.name, href: basePath }],
				kindSparePart,
				basePath
			)
		},
		kindSparePart
	);
};

const handleDefaultPage = async (kindSparePartSlug?: string): Promise<SparePartsPagePropsResult> => {
	const {
		data: { data }
	} = await pageApi.fetchPage('spare-part')();
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return withOptionalKindSparePart(
		{
			page: { seo: withKindSparePart(data.seo, 'запчасти', kindSparePart?.name) },
			breadcrumbs: [
				...ROOT_BREADCRUMBS,
				...(kindSparePart ? [{ text: kindSparePart.name, href: `/spare-parts/ksp-${kindSparePart.slug}` }] : [])
			]
		},
		kindSparePart
	);
};

const HANDLERS: Array<(params: SlugParams) => Promise<SparePartsPagePropsResult> | null> = [
	(params) => (params.productSlug ? handleProductPage(params.productSlug) : null),
	(params) =>
		params.generationSlug && params.modelSlug && params.brandParamSlug
			? handleGenerationPage(
					params.brandParamSlug,
					params.modelSlug,
					params.generationSlug,
					params.kindSparePartSlug
				)
			: null,
	(params) =>
		params.modelSlug && params.brandParamSlug
			? handleModelPage(params.brandParamSlug, params.modelSlug, params.kindSparePartSlug)
			: null,
	(params) => (params.brandParamSlug ? handleBrandPage(params.brandParamSlug, params.kindSparePartSlug) : null),
	(params) => handleDefaultPage(params.kindSparePartSlug)
];

export const buildPageProps = async (params: SlugParams): Promise<SparePartsPagePropsResult> => {
	for (const handler of HANDLERS) {
		const result = await handler(params);
		if (result !== null) return result;
	}

	return handleDefaultPage(params.kindSparePartSlug);
};
