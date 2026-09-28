import type { BrandService } from 'entities/brand';
import { withGeneration, type GenerationService, type GenerationWithModelAndBrand } from 'entities/generation';
import { withKindSparePart, type KindSparePart, type KindSparePartService } from 'entities/kindSparePart';
import type { ModelService } from 'entities/model';
import type { DefaultPage, PageProduct, PageProductSparePart, PageService } from 'entities/page';
import type { SparePart, SparePartService } from 'entities/sparePart';
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

const fetchKindSparePartIfNeeded = async (
	kindSparePartService: KindSparePartService,
	kindSparePartSlug?: string
): Promise<KindSparePart | undefined> => {
	if (!kindSparePartSlug) return undefined;
	const result = await kindSparePartService.fetchKindSpareParts({
		filters: { slug: kindSparePartSlug, type: 'regular' }
	});
	return result?.data?.data[0];
};

const handleProductPage = async (
	productSlug: string,
	pageService: PageService,
	sparePartService: SparePartService
): Promise<SparePartsPagePropsResult> => {
	const [
		{
			data: { data }
		},
		{
			data: { data: pageSparePart }
		}
	] = await Promise.all([
		sparePartService.fetchSparePart(productSlug),
		pageService.fetchPage<PageProductSparePart>('product-spare-part', { populate: ['seo'], fields: ['id'] })()
	]);

	const {
		data: { data: relatedProducts }
	} = await sparePartService.fetchSpareParts({
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
	generationService: GenerationService,
	kindSparePartService: KindSparePartService,
	kindSparePartSlug?: string
): Promise<SparePartsPagePropsResult> => {
	const [
		{
			data: { data: generations }
		}
	] = await Promise.all([
		generationService.fetchGeneration<GenerationWithModelAndBrand>({
			filters: { slug: generationParamSlug, model: { slug: modelSlug }, brand: { slug: brandParamSlug } },
			populate: ['model.seoSpareParts', 'brand']
		})
	]);

	const generation = generations?.[0];
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);

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
	modelService: ModelService,
	kindSparePartService: KindSparePartService,
	kindSparePartSlug?: string
): Promise<SparePartsPagePropsResult> => {
	const {
		data: { data }
	} = await modelService.fetchModelBySlug(modelSlug, {
		populate: ['seoSpareParts.images', 'brand'],
		filters: { brand: { slug: brandParamSlug } }
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);
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
	brandService: BrandService,
	kindSparePartService: KindSparePartService,
	kindSparePartSlug?: string
): Promise<SparePartsPagePropsResult> => {
	const {
		data: { data }
	} = await brandService.fetchBrandBySlug(brandParamSlug, {
		populate: ['seoSpareParts.images']
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);
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

const handleDefaultPage = async (
	kindSparePartSlug: string | undefined,
	pageService: PageService,
	kindSparePartService: KindSparePartService
): Promise<SparePartsPagePropsResult> => {
	const {
		data: { data }
	} = await pageService.fetchPage('spare-part')();
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);

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

const createHandlers = (
	pageService: PageService,
	sparePartService: SparePartService,
	brandService: BrandService,
	modelService: ModelService,
	generationService: GenerationService,
	kindSparePartService: KindSparePartService
): Array<(params: SlugParams) => Promise<SparePartsPagePropsResult> | null> => [
	(params) =>
		params.productSlug ? handleProductPage(params.productSlug, pageService, sparePartService) : null,
	(params) =>
		params.generationSlug && params.modelSlug && params.brandParamSlug
			? handleGenerationPage(
					params.brandParamSlug,
					params.modelSlug,
					params.generationSlug,
					generationService,
					kindSparePartService,
					params.kindSparePartSlug
				)
			: null,
	(params) =>
		params.modelSlug && params.brandParamSlug
			? handleModelPage(
					params.brandParamSlug,
					params.modelSlug,
					modelService,
					kindSparePartService,
					params.kindSparePartSlug
				)
			: null,
	(params) =>
		params.brandParamSlug
			? handleBrandPage(params.brandParamSlug, brandService, kindSparePartService, params.kindSparePartSlug)
			: null,
	(params) => handleDefaultPage(params.kindSparePartSlug, pageService, kindSparePartService)
];

export const buildPageProps = async (
	params: SlugParams,
	pageService: PageService,
	sparePartService: SparePartService,
	brandService: BrandService,
	modelService: ModelService,
	generationService: GenerationService,
	kindSparePartService: KindSparePartService
): Promise<SparePartsPagePropsResult> => {
	for (const handler of createHandlers(
		pageService,
		sparePartService,
		brandService,
		modelService,
		generationService,
		kindSparePartService
	)) {
		const result = await handler(params);
		if (result !== null) return result;
	}

	return handleDefaultPage(params.kindSparePartSlug, pageService, kindSparePartService);
};
