import { brandApi } from 'entities/brand';
import type { BrandWithSparePartsCount } from 'entities/brand/brandTypes';
import { API_MAX_LIMIT } from 'shared/api/constants';
import { generationApi } from 'entities/generation';
import type { GenerationWithModelAndBrand } from 'entities/generation/generationTypes';
import { kindSparePartApi } from 'entities/kindSparePart';
import type { KindSparePart } from 'entities/kindSparePart';
import { modelApi } from 'entities/model';
import { pageApi } from 'entities/page';
import type { DefaultPage, PageProduct, PageProductSparePart } from 'entities/page';
import { sparePartApi } from 'entities/sparePart';
import type { SparePart } from 'entities/sparePart';
import { CatalogSpareParts } from 'widgets/catalog';
import { Product } from 'widgets/product';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { getProductPageSeo } from 'entities/product';
import { withGeneration } from 'entities/generation';
import { withKindSparePart } from 'entities/kindSparePart';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';

interface Props {
	data: SparePart;
	relatedProducts: SparePart[];
	page: DefaultPage;
	brands: BrandWithSparePartsCount[];
	kindSparePart?: KindSparePart;
}

interface SlugParams {
	brandParamSlug?: string;
	modelSlug?: string;
	generationParamSlug?: string;
	productSlug?: string;
	kindSparePartSlug?: string;
}

const SpareParts: NextPage<Props> = ({ page, brands, kindSparePart, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return (
			<Product data={data} page={page as PageProduct & PageProductSparePart} relatedProducts={relatedProducts} />
		);
	}
	return <CatalogSpareParts pageData={page} brands={brands} kindSparePart={kindSparePart}></CatalogSpareParts>;
};

export default SpareParts;

const fetchBrandsData = async (): Promise<BrandWithSparePartsCount[]> => {
	const {
		data: { data: brands }
	} = await brandApi.fetchBrands({
		populate: { image: true, spareParts: { count: true } },
		sort: 'name',
		pagination: { limit: API_MAX_LIMIT },
		filters: {
			spareParts: {
				id: {
					$notNull: true
				}
			}
		}
	});
	return brands as BrandWithSparePartsCount[];
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

	const result = await kindSparePartApi.fetchKindSpareParts({ filters: { slug: kindSparePartSlug } });
	return result?.data?.data[0];
};

const handleProductPage = async (productSlug: string, kindSparePartSlug?: string) => {
	const [
		{
			data: { data }
		},
		{
			data: { data: page }
		},
		{
			data: { data: pageSparePart }
		}
	] = await Promise.all([
		sparePartApi.fetchSparePart(productSlug),
		pageApi.fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
		pageApi.fetchPage<PageProductSparePart>('product-spare-part', { populate: ['seo'] })()
	]);

	const {
		data: { data: relatedProducts }
	} = await sparePartApi.fetchSpareParts({
		filters: {
			sold: false,
			id: { $ne: data.id },
			model: data.model?.id || ''
		},
		populate: ['images', 'brand']
	});

	const autoSynonyms = pageSparePart?.autoSynonyms.split(',') || [];
	const randomAutoSynonym = autoSynonyms[Math.floor(Math.random() * autoSynonyms.length)];

	return {
		data,
		relatedProducts,
		page: {
			...page,
			...pageSparePart,
			additionalDescription: getStringByTemplateStr(pageSparePart.additionalDescription, data),
			textAfterDescription: pageSparePart.textAfterDescription.replace('{autoSynonyms}', randomAutoSynonym),
			seo: {
				...getProductPageSeo(pageSparePart.seo, data),
				h1: data.h1 || data.name
			}
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Запчасти', href: '/spare-parts' },
			{ text: data.brand?.name, href: `/spare-parts/${data.brand?.slug}` },
			{ text: data.name, href: `/spare-parts/${data.brand?.slug}/${data.slug}` }
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
			populate: ['model.seoSpareParts', 'brand']
		})
	]);

	const generation = resultGeneration?.data?.data[0];
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return {
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
		...(kindSparePart ? { kindSparePart } : {}),
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Запчасти', href: '/spare-parts' },
			{ text: generation.brand.name, href: `/spare-parts/${generation.brand?.slug}` },
			{
				text: generation.model.name,
				href: `/spare-parts/${generation.brand?.slug}/model-${generation.model.slug}`
			},
			{
				text: generation.name,
				href: `/spare-parts/${generation.brand?.slug}/model-${generation.model.slug}/${generation.slug}`
			}
		]
	};
};

const handleModelPage = async (brandParamSlug: string, modelSlug: string, kindSparePartSlug?: string) => {
	const {
		data: { data }
	} = await modelApi.fetchModelBySlug(modelSlug, {
		populate: ['seoSpareParts.images', 'image', 'brand'],
		filters: { brand: { slug: brandParamSlug } }
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name)
		},
		...(kindSparePart ? { kindSparePart } : {}),
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Запчасти', href: '/spare-parts' },
			{ text: data.brand?.name, href: `/spare-parts/${data.brand?.slug}` },
			{ text: data.name, href: `/spare-parts/${data.brand?.slug}/model-${data.slug}` }
		]
	};
};

const handleBrandPage = async (brandParamSlug: string, kindSparePartSlug?: string) => {
	const {
		data: { data }
	} = await brandApi.fetchBrandBySlug(brandParamSlug, {
		populate: ['seoSpareParts.images', 'image']
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name)
		},
		...(kindSparePart ? { kindSparePart } : {}),
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Запчасти', href: '/spare-parts' },
			{ text: data.name, href: `/spare-parts/${data.slug}` }
		]
	};
};

const handleDefaultPage = async (kindSparePartSlug?: string) => {
	const {
		data: { data }
	} = await pageApi.fetchPage('spare-part')();
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seo, 'запчасти', kindSparePart?.name)
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Запчасти', href: '/spare-parts' }
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
