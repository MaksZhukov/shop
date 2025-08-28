import { fetchBrandBySlug, fetchBrands } from 'api/brands/brands';
import { BrandWithSparePartsCount } from 'api/brands/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchGeneration } from 'api/generations/generations';
import { GenerationWithModelAndBrand } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModelBySlug } from 'api/models/models';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductSparePart } from 'api/pages/types';
import { fetchSparePart, fetchSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import CatalogSpareParts from 'components/CatalogSpareParts';
import Product from 'components/features/Product';
import type { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';
import { withGeneration, withKindSparePart } from 'services/SEOService';
import { getStringByTemplateStr } from 'services/StringService';

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
			<Product
				data={data}
				printOptions={[
					{ text: 'Артикул', value: data.id },
					{ text: 'Поколение', value: data.generation?.name },
					...(data.engineNumber ? [{ text: 'Маркировка двигателя', value: data.engineNumber }] : []),
					...(data.engine ? [{ text: 'Двигатель', value: data.engine }] : []),
					{ text: 'Запчасть', value: data.kindSparePart?.name },
					{ text: 'Марка', value: data.brand?.name },
					{ text: 'Модель', value: data.model?.name },
					{ text: 'Год', value: data.year },
					{ text: 'Коробка', value: data.transmission },
					{ text: 'Обьем', value: data.volume?.name },
					{ text: 'Тип топлива', value: data.fuel as any }
				]}
				page={page as PageProduct & PageProductSparePart}
				relatedProducts={relatedProducts}
			></Product>
		);
	}
	return <CatalogSpareParts pageData={page} brands={brands} kindSparePart={kindSparePart}></CatalogSpareParts>;
};

export default SpareParts;

const fetchBrandsData = async (): Promise<BrandWithSparePartsCount[]> => {
	const {
		data: { data: brands }
	} = await fetchBrands({
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

	const result = await fetchKindSpareParts({ filters: { slug: kindSparePartSlug } });
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
		fetchSparePart(productSlug),
		fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
		fetchPage<PageProductSparePart>('product-spare-part', { populate: ['seo'] })()
	]);

	const {
		data: { data: relatedProducts }
	} = await fetchSpareParts({
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
		}
	};
};

const handleGenerationPage = async (
	brandParamSlug: string,
	modelSlug: string,
	generationParamSlug: string,
	kindSparePartSlug?: string
) => {
	const [resultGeneration] = await Promise.all([
		fetchGeneration<GenerationWithModelAndBrand>({
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
		...(kindSparePart ? { kindSparePart } : {})
	};
};

const handleModelPage = async (brandParamSlug: string, modelSlug: string, kindSparePartSlug?: string) => {
	const {
		data: { data }
	} = await fetchModelBySlug(modelSlug, {
		populate: ['seoSpareParts.images', 'image'],
		filters: { brand: { slug: brandParamSlug } }
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name)
		},
		...(kindSparePart ? { kindSparePart } : {})
	};
};

const handleBrandPage = async (brandParamSlug: string, kindSparePartSlug?: string) => {
	const {
		data: { data }
	} = await fetchBrandBySlug(brandParamSlug, {
		populate: ['seoSpareParts.images', 'image']
	});

	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name)
		},
		...(kindSparePart ? { kindSparePart } : {})
	};
};

const handleDefaultPage = async (kindSparePartSlug?: string) => {
	const {
		data: { data }
	} = await fetchPage('spare-part')();
	const kindSparePart = await fetchKindSparePartIfNeeded(kindSparePartSlug);

	return {
		page: {
			seo: withKindSparePart(data.seo, 'запчасти', kindSparePart?.name)
		},
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
	const { slug = [], kindSparePart: kindSparePartSlug } = context.query;

	const params = parseParams(slug as string[], kindSparePartSlug as string);

	const brands = await fetchBrandsData();

	const pageProps = await buildPageProps(params);

	const props = {
		brands,
		...pageProps
	};

	return { props };
});
