import { pageApi } from 'entities/page';
import type { DefaultPage, PageProduct, PageProductWheel } from 'entities/page';
import { brandApi } from 'entities/brand';
import type { BrandWithWheelsCount } from 'entities/brand';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'shared/api/constants';
import { modelApi } from 'entities/model';
import { CatalogWheels } from 'widgets/catalog';
import { Product } from 'widgets/product';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { getProductPageSeo } from 'entities/product';
import type { Wheel } from 'entities/wheel';
import { wheelApi } from 'entities/wheel';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';

interface Props {
	page: DefaultPage;
	brands: BrandWithWheelsCount[];
	data?: Wheel;
	relatedProducts?: Wheel[];
}

interface SlugParams {
	brandParamSlug?: string;
	modelSlug?: string;
	productSlug?: string;
}

const Wheels: NextPage<Props> = ({ page, brands, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return (
			<Product
				data={data}
				page={page as DefaultPage & PageProduct & PageProductWheel}
				relatedProducts={relatedProducts}
			/>
		);
	}
	return <CatalogWheels pageData={page} brands={brands} />;
};

export default Wheels;

const fetchBrandsData = async (): Promise<BrandWithWheelsCount[]> => {
	const {
		data: { data: brands }
	} = await brandApi.fetchBrands({
		populate: { wheels: { count: true } },
		sort: 'name',
		pagination: { limit: API_MAX_LIMIT },
		filters: {
			wheels: {
				id: { $notNull: true }
			}
		}
	});
	return brands as BrandWithWheelsCount[];
};

const parseParams = (slug: string[]): SlugParams => {
	const [brandParamSlug, modelOrProductParamSlug] = slug;
	const productSlug =
		modelOrProductParamSlug && !modelOrProductParamSlug.startsWith('model-') ? modelOrProductParamSlug : undefined;
	const modelSlug = modelOrProductParamSlug?.startsWith('model-')
		? modelOrProductParamSlug.replace('model-', '')
		: undefined;
	return { brandParamSlug, modelSlug, productSlug };
};

const handleProductPage = async (brandParamSlug: string, productSlug: string) => {
	const [
		{
			data: { data: wheel }
		},
		{
			data: { data: page }
		},
		{
			data: { data: pageWheel }
		}
	] = await Promise.all([
		wheelApi.fetchWheel(productSlug),
		pageApi.fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
		pageApi.fetchPage<PageProductWheel>('product-wheel', { populate: ['seo'] })()
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
		...(page ?? {}),
		...(pageWheel ?? {}),
		additionalDescription: pageWheel?.additionalDescription
			? getStringByTemplateStr(pageWheel.additionalDescription, wheel)
			: '',
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
			{ text: 'Главная', href: '/' },
			{ text: 'Диски', href: '/wheels' },
			{ text: wheel.brand?.name ?? '', href: `/wheels/${wheel.brand?.slug}` },
			{ text: wheel.name, href: `/wheels/${wheel.brand?.slug}/${wheel.slug}` }
		]
	};
};

const handleModelPage = async (brandParamSlug: string, modelSlug: string) => {
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
			{ text: 'Главная', href: '/' },
			{ text: 'Диски', href: '/wheels' },
			{ text: data.brand?.name ?? '', href: `/wheels/${data.brand?.slug}` },
			{ text: data.name, href: `/wheels/${data.brand?.slug}/model-${data.slug}` }
		]
	};
};

const handleBrandPage = async (brandParamSlug: string) => {
	const {
		data: { data }
	} = await brandApi.fetchBrandBySlug(brandParamSlug, {
		populate: ['seoWheels']
	});

	if (!data) return null;

	return {
		page: { seo: data.seoWheels },
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Диски', href: '/wheels' },
			{ text: data.name, href: `/wheels/${data.slug}` }
		]
	};
};

const handleDefaultPage = async () => {
	const {
		data: { data }
	} = await pageApi.fetchPage('wheel')();

	return {
		page: { seo: data.seo },
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Диски', href: '/wheels' }
		]
	};
};

type Breadcrumb = { text: string; href: string };

const buildPageProps = async (
	params: SlugParams
): Promise<{ page: DefaultPage; breadcrumbs: Breadcrumb[]; data?: Wheel; relatedProducts?: Wheel[] } | null> => {
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

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const { slug = [] } = context.query;
		const slugArray = slug as string[];
		const params = parseParams(slugArray);

		const pageProps = await buildPageProps(params);
		if (!pageProps) return { props: {}, notFound: true };

		const brands = await fetchBrandsData();
		return { props: { brands, ...pageProps } };
	} catch {
		return { props: {}, notFound: true };
	}
});
