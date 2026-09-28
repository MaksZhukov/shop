import type { BrandService } from 'entities/brand';
import type { Cabin, CabinService } from 'entities/cabin';
import { withGeneration, type GenerationService, type GenerationWithModelAndBrand } from 'entities/generation';
import { withKindSparePart, type KindSparePart, type KindSparePartService } from 'entities/kindSparePart';
import type { ModelService } from 'entities/model';
import type { DefaultPage, PageProductCabin, PageService } from 'entities/page';
import { getProductPageSeo } from 'entities/product';
import type { SlugParams } from '../types';

const CABINS_BASE_PATH = '/cabins';
const CABINS_LABEL = 'Салоны';

export interface CabinsPagePropsResult {
	data?: Cabin;
	relatedProducts?: Cabin[];
	page?: DefaultPage & Record<string, unknown>;
	breadcrumbs?: Array<{ text: string; href: string }>;
	kindSparePart?: KindSparePart;
	generation?: { id: number; name: string; slug: string };
}

const fetchKindSparePartIfNeeded = async (
	kindSparePartService: KindSparePartService,
	kindSparePartSlug?: string
): Promise<KindSparePart | undefined> => {
	if (!kindSparePartSlug) return undefined;

	const result = await kindSparePartService.fetchKindSpareParts({
		filters: { slug: kindSparePartSlug, type: 'cabin' }
	});
	return result?.data?.data[0];
};

const handleProductPage = async (
	productSlug: string,
	_kindSparePartSlug: string | undefined,
	pageService: PageService,
	cabinService: CabinService
): Promise<CabinsPagePropsResult> => {
	const [
		{
			data: { data }
		},
		{
			data: { data: pageCabin }
		}
	] = await Promise.all([
		cabinService.fetchCabin(productSlug),
		pageService.fetchPage<PageProductCabin>('product-cabin', { populate: ['seo'], fields: ['id'] })()
	]);

	const {
		data: { data: relatedProducts }
	} = await cabinService.fetchCabins({
		filters: {
			sold: false,
			id: { $ne: data.id },
			...(data.model?.id && { model: data.model.id })
		},
		populate: ['images', 'brand'],
		pagination: { limit: 30 }
	});

	return {
		data,
		relatedProducts: relatedProducts ?? [],
		page: {
			seo: {
				...getProductPageSeo(pageCabin.seo, data),
				h1: data.h1 || data.name
			}
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: CABINS_LABEL, href: CABINS_BASE_PATH },
			{ text: data.brand?.name!, href: `${CABINS_BASE_PATH}/${data.brand?.slug}` },
			{ text: data.name, href: `${CABINS_BASE_PATH}/${data.brand?.slug}/${data.slug}` }
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
): Promise<CabinsPagePropsResult> => {
	const [resultGeneration] = await Promise.all([
		generationService.fetchGeneration<GenerationWithModelAndBrand>({
			filters: {
				slug: generationParamSlug,
				model: { slug: modelSlug },
				brand: { slug: brandParamSlug }
			},
			populate: ['model.seoCabins', 'brand']
		})
	]);

	const generation = resultGeneration?.data?.data[0];
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);

	return {
		generation: { id: generation.id, name: generation.name, slug: generation.slug },
		page: {
			seo: withKindSparePart(
				withGeneration(
					generation.model.seoCabins,
					`${generation.brand.name} ${generation.model.name}`,
					generation.name
				),
				CABINS_LABEL,
				kindSparePart?.name
			)
		},
		...(kindSparePart ? { kindSparePart } : {}),
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: CABINS_LABEL, href: CABINS_BASE_PATH },
			{ text: generation.brand.name, href: `${CABINS_BASE_PATH}/${generation.brand?.slug}` },
			{
				text: generation.model.name,
				href: `${CABINS_BASE_PATH}/${generation.brand?.slug}/model-${generation.model.slug}`
			},
			{
				text: generation.name,
				href: `${CABINS_BASE_PATH}/${generation.brand?.slug}/model-${generation.model.slug}/${generation.slug}`
			}
		]
	};
};

const handleModelPage = async (
	brandParamSlug: string,
	modelSlug: string,
	modelService: ModelService,
	kindSparePartService: KindSparePartService,
	kindSparePartSlug?: string
): Promise<CabinsPagePropsResult> => {
	const {
		data: { data }
	} = await modelService.fetchModelBySlug(modelSlug, {
		populate: ['seoCabins.images', 'brand'],
		filters: { brand: { slug: brandParamSlug } }
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seoCabins, CABINS_LABEL, kindSparePart?.name)
		},
		...(kindSparePart ? { kindSparePart } : {}),
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: CABINS_LABEL, href: CABINS_BASE_PATH },
			{ text: data.brand?.name!, href: `${CABINS_BASE_PATH}/${data.brand?.slug}` },
			{ text: data.name, href: `${CABINS_BASE_PATH}/${data.brand?.slug}/model-${data.slug}` }
		]
	};
};

const handleBrandPage = async (
	brandParamSlug: string,
	brandService: BrandService,
	kindSparePartService: KindSparePartService,
	kindSparePartSlug?: string
): Promise<CabinsPagePropsResult> => {
	const {
		data: { data }
	} = await brandService.fetchBrandBySlug(brandParamSlug, {
		populate: ['seoCabins.images']
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seoCabins, CABINS_LABEL, kindSparePart?.name)
		},
		...(kindSparePart ? { kindSparePart } : {}),
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: CABINS_LABEL, href: CABINS_BASE_PATH },
			{ text: data.name, href: `${CABINS_BASE_PATH}/${data.slug}` }
		]
	};
};

const handleDefaultPage = async (
	kindSparePartSlug: string | undefined,
	pageService: PageService,
	kindSparePartService: KindSparePartService
): Promise<CabinsPagePropsResult> => {
	const {
		data: { data }
	} = await pageService.fetchPage('cabin')();
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartService, kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seo, CABINS_LABEL, kindSparePart?.name)
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: CABINS_LABEL, href: CABINS_BASE_PATH }
		],
		...(kindSparePart ? { kindSparePart } : {})
	};
};

const createHandlers = (
	pageService: PageService,
	cabinService: CabinService,
	brandService: BrandService,
	modelService: ModelService,
	generationService: GenerationService,
	kindSparePartService: KindSparePartService
): Array<(params: SlugParams) => Promise<CabinsPagePropsResult> | null> => [
	(params) =>
		params.productSlug
			? handleProductPage(params.productSlug, params.kindSparePartSlug, pageService, cabinService)
			: null,
	(params) =>
		params.generationParamSlug && params.modelSlug && params.brandParamSlug
			? handleGenerationPage(
					params.brandParamSlug,
					params.modelSlug,
					params.generationParamSlug,
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
	cabinService: CabinService,
	brandService: BrandService,
	modelService: ModelService,
	generationService: GenerationService,
	kindSparePartService: KindSparePartService
): Promise<CabinsPagePropsResult> => {
	for (const handler of createHandlers(
		pageService,
		cabinService,
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
