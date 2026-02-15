import type { DefaultPage, PageProduct, PageProductTire } from 'entities/page';
import { pageApi } from 'entities/page';
import { getProductPageSeo } from 'entities/product';
import type { Tire } from 'entities/tire';
import { tireApi } from 'entities/tire';
import { Product } from 'widgets/product';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';
import { API_DEFAULT_LIMIT } from 'shared/api/constants';

interface Props {
	data: Tire;
	relatedProducts: Tire[];
	page: DefaultPage & PageProduct & PageProductTire;
	breadcrumbs: Array<{ text: string; href: string }>;
}

const TireProductPage: NextPage<Props> = ({ data, page, relatedProducts }) => (
	<Product data={data} page={page} relatedProducts={relatedProducts} />
);

export default TireProductPage;

export const getServerSideProps = getPageProps(undefined, async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Record<string, string | number | object>>> => {
	const { brand: brandSlug, slug: tireSlug } = context.params as { brand: string; slug: string };

	let tire: Tire | null = null;
	let page: PageProduct | null = null;
	let pageTire: PageProductTire | null = null;

	try {
		const [tireRes, pageRes, pageTireRes] = await Promise.all([
			tireApi.fetchTire(tireSlug),
			pageApi.fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })().catch(() => ({ data: { data: null } })),
			pageApi.fetchPage<PageProductTire>('product-tire', { populate: ['seo'] })().catch(() => ({ data: { data: null } }))
		]);
		tire = tireRes?.data?.data ?? null;
		page = pageRes?.data?.data ?? null;
		pageTire = pageTireRes?.data?.data ?? null;
	} catch {
		return { notFound: true };
	}

	if (!tire || tire.brand?.slug !== brandSlug) {
		return { notFound: true };
	}

	let relatedTires: Tire[] = [];
	try {
		const { data: { data: related } } = await tireApi.fetchTires({
			filters: {
				sold: false,
				id: { $ne: tire.id },
				brand: { id: tire.brand?.id }
			},
			populate: ['brand', 'images'],
			pagination: { limit: API_DEFAULT_LIMIT }
		});
		relatedTires = related ?? [];
	} catch {
		// continue without related products
	}

	const mergedPage = {
		...(page ?? {}),
		...(pageTire ?? {}),
		additionalDescription: pageTire?.additionalDescription
			? getStringByTemplateStr(pageTire.additionalDescription, tire)
			: '',
		seo: {
			...(pageTire?.seo ? getProductPageSeo(pageTire.seo, tire) : {}),
			h1: tire.h1 || tire.name
		}
	};

	return {
		props: {
			data: tire,
			relatedProducts: relatedTires,
			page: mergedPage,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Шины', href: '/tires' },
				{ text: tire.brand?.name ?? '', href: `/tires/${tire.brand?.slug ?? ''}` },
				{ text: tire.name, href: `/tires/${tire.brand?.slug}/${tire.slug}` }
			]
		}
	};
});
