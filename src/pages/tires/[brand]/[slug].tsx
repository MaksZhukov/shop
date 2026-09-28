import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage, type PageProduct, type PageProductTire } from 'entities/page';
import { TireService, type Tire } from 'entities/tire';
import { Product } from 'features/product';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import { ShareButton } from 'features/share';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { buildTireProductPageProps } from 'features/catalog';

interface Props {
	data: Tire;
	relatedProducts: Tire[];
	page: DefaultPage & PageProduct & PageProductTire;
	breadcrumbs: Array<{ text: string; href: string }>;
}

const TireProductPage: NextPage<Props> = ({ data, page, relatedProducts }) => (
	<Product
		data={data}
		page={page}
		relatedProducts={relatedProducts}
		renderShare={(props) => <ShareButton {...props} />}
		renderFavorite={(product, title) => <FavoriteButton product={product} title={title} />}
		renderCart={(product, sx) => <CartButton product={product} sx={sx} />}
	/>
);

export default TireProductPage;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const { brand: brandSlug, slug: tireSlug } = context.params as { brand: string; slug: string };

	const container = createRequestContainer();
	const pageService = container.get(PageService);
	const tireService = container.get(TireService);
	const pageProps = await buildTireProductPageProps(brandSlug, tireSlug, pageService, tireService);
	if (!pageProps) return { notFound: true };

	return { props: { ...pageProps } };
});
