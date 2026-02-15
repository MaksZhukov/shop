import { pageApi } from 'entities/page';
import type { DefaultPage } from 'entities/page';
import { brandApi } from 'entities/brand';
import { modelApi } from 'entities/model';
import { CatalogWheels } from 'widgets/catalog';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage;
}

interface SlugParams {
	brandParamSlug?: string;
	modelSlug?: string;
}

const Wheels: NextPage<Props> = ({ page }) => {
	return <CatalogWheels pageData={page} />;
};

export default Wheels;

const parseParams = (slug: string[]): SlugParams => {
	const [brandParamSlug, modelOrOther] = slug;
	const modelSlug =
		modelOrOther && modelOrOther.startsWith('model-') ? modelOrOther.replace('model-', '') : undefined;
	return { brandParamSlug, modelSlug };
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
): Promise<{ page: DefaultPage; breadcrumbs: Breadcrumb[] } | null> => {
	const { brandParamSlug, modelSlug } = params;

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
		return { props: pageProps };
	} catch {
		return { props: {}, notFound: true };
	}
});
