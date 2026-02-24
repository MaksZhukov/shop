import { brandApi } from 'entities/brand';
import { cabinApi } from 'entities/cabin';
import type { Cabin } from 'entities/cabin';
import { generationApi } from 'entities/generation';
import type { GenerationWithModelAndBrand } from 'entities/generation/generationTypes';
import { withGeneration } from 'entities/generation';
import { kindSparePartApi } from 'entities/kindSparePart';
import type { KindSparePart } from 'entities/kindSparePart';
import { withKindSparePart } from 'entities/kindSparePart';
import { modelApi } from 'entities/model';
import { pageApi } from 'entities/page';
import type { DefaultPage, PageProductCabin } from 'entities/page';
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

const fetchKindSparePartIfNeeded = async (kindSparePartSlug?: string): Promise<KindSparePart | undefined> => {
	if (!kindSparePartSlug) return undefined;

	const result = await kindSparePartApi.fetchKindSpareParts({
		filters: { slug: kindSparePartSlug, type: 'cabin' }
	});
	return result?.data?.data[0];
};

const handleProductPage = async (productSlug: string, _kindSparePartSlug?: string): Promise<CabinsPagePropsResult> => {
	const [
		{
			data: { data }
		},
		{
			data: { data: pageCabin }
		}
	] = await Promise.all([
		cabinApi.fetchCabin(productSlug),
		pageApi.fetchPage<PageProductCabin>('product-cabin', { populate: ['seo'], fields: ['id'] })()
	]);

	const {
		data: { data: relatedProducts }
	} = await cabinApi.fetchCabins({
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
	kindSparePartSlug?: string
): Promise<CabinsPagePropsResult> => {
	const [resultGeneration] = await Promise.all([
		generationApi.fetchGeneration<GenerationWithModelAndBrand>({
			filters: {
				slug: generationParamSlug,
				model: { slug: modelSlug },
				brand: { slug: brandParamSlug }
			},
			populate: ['model.seoCabins', 'brand']
		})
	]);

	const generation = resultGeneration?.data?.data[0];
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

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
	kindSparePartSlug?: string
): Promise<CabinsPagePropsResult> => {
	const {
		data: { data }
	} = await modelApi.fetchModelBySlug(modelSlug, {
		populate: ['seoCabins.images', 'brand'],
		filters: { brand: { slug: brandParamSlug } }
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

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

const handleBrandPage = async (brandParamSlug: string, kindSparePartSlug?: string): Promise<CabinsPagePropsResult> => {
	const {
		data: { data }
	} = await brandApi.fetchBrandBySlug(brandParamSlug, {
		populate: ['seoCabins.images']
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

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

const handleDefaultPage = async (kindSparePartSlug?: string): Promise<CabinsPagePropsResult> => {
	const {
		data: { data }
	} = await pageApi.fetchPage('cabin')();
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

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

const HANDLERS: Array<(params: SlugParams) => Promise<CabinsPagePropsResult> | null> = [
	(params) => (params.productSlug ? handleProductPage(params.productSlug, params.kindSparePartSlug) : null),
	(params) =>
		params.generationParamSlug && params.modelSlug && params.brandParamSlug
			? handleGenerationPage(
					params.brandParamSlug,
					params.modelSlug,
					params.generationParamSlug,
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

export const buildPageProps = async (params: SlugParams): Promise<CabinsPagePropsResult> => {
	for (const handler of HANDLERS) {
		const result = await handler(params);
		if (result !== null) return result;
	}

	return handleDefaultPage(params.kindSparePartSlug);
};
