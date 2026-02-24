import type { DefaultPage, PageProduct, PageProductTire } from 'entities/page';
import type { Tire } from 'entities/tire';
import { Product } from 'widgets/product';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { buildProductPageProps } from 'features/tiresCatalog';

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

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const { brand: brandSlug, slug: tireSlug } = context.params as { brand: string; slug: string };

	const pageProps = await buildProductPageProps(brandSlug, tireSlug);
	if (!pageProps) return { notFound: true };

	return { props: { ...pageProps } };
});
