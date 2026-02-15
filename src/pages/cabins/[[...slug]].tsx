import { brandApi } from 'entities/brand';
import type { BrandWithCabinsCount } from 'entities/brand/brandTypes';
import { API_MAX_LIMIT } from 'shared/api/constants';
import { cabinApi } from 'entities/cabin';
import type { Cabin } from 'entities/cabin';
import { generationApi } from 'entities/generation';
import type { GenerationWithModelAndBrand } from 'entities/generation/generationTypes';
import { kindSparePartApi } from 'entities/kindSparePart';
import type { KindSparePart } from 'entities/kindSparePart';
import { modelApi } from 'entities/model';
import { pageApi } from 'entities/page';
import type { DefaultPage, PageProduct, PageProductCabin } from 'entities/page';
import { CatalogCabins } from 'widgets/catalog';
import { Product } from 'widgets/product';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { getProductPageSeo } from 'entities/product';
import { withGeneration } from 'entities/generation';
import { withKindSparePart } from 'entities/kindSparePart';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';

const CABINS_BASE_PATH = '/cabins';
const CABINS_LABEL = 'Салоны';

interface Props {
	data: Cabin;
	relatedProducts: Cabin[];
	page: DefaultPage;
	brands: BrandWithCabinsCount[];
	kindSparePart?: KindSparePart;
}

interface SlugParams {
	brandParamSlug?: string;
	modelSlug?: string;
	generationParamSlug?: string;
	productSlug?: string;
	kindSparePartSlug?: string;
}

const Cabins: NextPage<Props> = ({ page, brands, kindSparePart, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return <Product data={data} page={page as PageProduct & PageProductCabin} relatedProducts={relatedProducts} />;
	}
	return <CatalogCabins pageData={page} brands={brands} kindSparePart={kindSparePart} />;
};

export default Cabins;

const fetchBrandsData = async (): Promise<BrandWithCabinsCount[]> => {
	const {
		data: { data: brands }
	} = await brandApi.fetchBrands({
		populate: { cabins: { count: true } },
		sort: 'name',
		pagination: { limit: API_MAX_LIMIT },
		filters: {
			cabins: {
				id: {
					$notNull: true
				}
			}
		}
	});
	return brands as BrandWithCabinsCount[];
};

const parseParams = (slug: string[], kindSparePartSlug?: string): SlugParams => {
	const [brandParamSlug, modelOrProductParamSlug, generationParamSlug] = slug;

	const productSlug =
		modelOrProductParamSlug && !modelOrProductParamSlug.includes('model-') ? modelOrProductParamSlug : undefined;

	const modelSlug =
		modelOrProductParamSlug && modelOrProductParamSlug.includes('model-')
			? modelOrProductParamSlug.replace('model-', '')
			: undefined;

	return {
		brandParamSlug,
		modelSlug,
		generationParamSlug,
		productSlug,
		kindSparePartSlug
	};
};

const fetchKindSparePartIfNeeded = async (kindSparePartSlug?: string): Promise<KindSparePart | undefined> => {
	if (!kindSparePartSlug) return undefined;

	const result = await kindSparePartApi.fetchKindSpareParts({
		filters: { slug: kindSparePartSlug, type: 'cabin' }
	});
	return result?.data?.data[0];
};

const handleProductPage = async (productSlug: string, _kindSparePartSlug?: string) => {
	const [
		{
			data: { data }
		},
		{
			data: { data: page }
		},
		{
			data: { data: pageCabin }
		}
	] = await Promise.all([
		cabinApi.fetchCabin(productSlug),
		pageApi.fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
		pageApi.fetchPage<PageProductCabin>('product-cabin', { populate: ['seo'] })()
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
			...page,
			...pageCabin,
			additionalDescription: pageCabin?.additionalDescription
				? getStringByTemplateStr(pageCabin.additionalDescription, data)
				: '',
			textAfterDescription: pageCabin?.textAfterDescription ?? '',
			seo: {
				...getProductPageSeo(pageCabin.seo, data),
				h1: data.h1 || data.name
			}
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: CABINS_LABEL, href: CABINS_BASE_PATH },
			{ text: data.brand?.name, href: `${CABINS_BASE_PATH}/${data.brand?.slug}` },
			{ text: data.name, href: `${CABINS_BASE_PATH}/${data.brand?.slug}/${data.slug}` }
		]
	};
};

const handleGenerationPage = async (
	brandParamSlug: string,
	modelSlug: string,
	generationParamSlug: string,
	kindSparePartSlug?: string
) => {
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

const handleModelPage = async (brandParamSlug: string, modelSlug: string, kindSparePartSlug?: string) => {
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
			{ text: data.brand?.name, href: `${CABINS_BASE_PATH}/${data.brand?.slug}` },
			{ text: data.name, href: `${CABINS_BASE_PATH}/${data.brand?.slug}/model-${data.slug}` }
		]
	};
};

const handleBrandPage = async (brandParamSlug: string, kindSparePartSlug?: string) => {
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

const handleDefaultPage = async (kindSparePartSlug?: string) => {
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

const buildPageProps = async (params: SlugParams): Promise<Partial<Props>> => {
	const { brandParamSlug, modelSlug, generationParamSlug, productSlug, kindSparePartSlug } = params;

	if (productSlug) {
		return await handleProductPage(productSlug, kindSparePartSlug);
	}

	if (generationParamSlug && modelSlug && brandParamSlug) {
		return await handleGenerationPage(brandParamSlug, modelSlug, generationParamSlug, kindSparePartSlug);
	}

	if (modelSlug && brandParamSlug) {
		return await handleModelPage(brandParamSlug, modelSlug, kindSparePartSlug);
	}

	if (brandParamSlug) {
		return await handleBrandPage(brandParamSlug, kindSparePartSlug);
	}

	return await handleDefaultPage(kindSparePartSlug);
};

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const { slug = [], kindSparePart: kindSparePartSlug } = context.query;

		const params = parseParams(slug as string[], kindSparePartSlug as string);

		const brands = await fetchBrandsData();

		const pageProps = await buildPageProps(params);

		const props = {
			brands,
			...pageProps
		};

		return { props };
	} catch (error) {
		return { props: {}, notFound: true };
	}
});
