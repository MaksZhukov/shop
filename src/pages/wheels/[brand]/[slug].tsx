import type { DefaultPage, PageProduct, PageProductWheel } from 'entities/page';
import { pageApi } from 'entities/page';
import { getProductPageSeo } from 'entities/product';
import type { Wheel } from 'entities/wheel';
import { wheelApi } from 'entities/wheel';
import { Product } from 'widgets/product';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { getStringByTemplateStr } from 'shared/utils/stringUtils';
import { API_DEFAULT_LIMIT } from 'shared/api/constants';

interface Props {
	data: Wheel;
	relatedProducts: Wheel[];
	page: DefaultPage & PageProduct & PageProductWheel;
	breadcrumbs: Array<{ text: string; href: string }>;
}

const WheelProductPage: NextPage<Props> = ({ data, page, relatedProducts }) => (
	<Product data={data} page={page} relatedProducts={relatedProducts} />
);

export default WheelProductPage;

export const getServerSideProps = getPageProps(undefined, async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Record<string, string | number | object>>> => {
	const { brand: brandSlug, slug: wheelSlug } = context.params as { brand: string; slug: string };

	let wheel: Wheel | null = null;
	let page: PageProduct | null = null;
	let pageWheel: PageProductWheel | null = null;

	try {
		const [wheelRes, pageRes, pageWheelRes] = await Promise.all([
			wheelApi.fetchWheel(wheelSlug),
			pageApi.fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })().catch(() => ({ data: { data: null } })),
			pageApi.fetchPage<PageProductWheel>('product-wheel', { populate: ['seo'] })().catch(() => ({ data: { data: null } }))
		]);
		wheel = wheelRes?.data?.data ?? null;
		page = pageRes?.data?.data ?? null;
		pageWheel = pageWheelRes?.data?.data ?? null;
	} catch {
		return { notFound: true };
	}

	if (!wheel || wheel.brand?.slug !== brandSlug) {
		return { notFound: true };
	}

	let relatedWheels: Wheel[] = [];
	try {
		const { data: { data: related } } = await wheelApi.fetchWheels({
			filters: {
				sold: false,
				id: { $ne: wheel.id },
				brand: { id: wheel.brand?.id }
			},
			populate: ['brand', 'images', 'model'],
			pagination: { limit: API_DEFAULT_LIMIT }
		});
		relatedWheels = related ?? [];
	} catch {
		// continue without related products
	}

	const mergedPage = {
		...(page ?? {}),
		...(pageWheel ?? {}),
		additionalDescription: pageWheel?.additionalDescription
			? getStringByTemplateStr(pageWheel.additionalDescription, wheel)
			: '',
		seo: {
			...(pageWheel?.seo ? getProductPageSeo(pageWheel.seo, wheel) : {}),
			h1: wheel.h1 || wheel.name
		}
	};

	return {
		props: {
			data: wheel,
			relatedProducts: relatedWheels,
			page: mergedPage,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Диски', href: '/wheels' },
				{ text: wheel.brand?.name ?? '', href: `/wheels?brand=${encodeURIComponent(wheel.brand?.slug ?? '')}` },
				{ text: wheel.name, href: `/wheels/${wheel.brand?.slug}/${wheel.slug}` }
			]
		}
	};
});
