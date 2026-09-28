import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage, type PageProduct, type PageProductWheel } from 'entities/page';
import { CatalogWheels } from 'features/catalog';
import { Product } from 'features/product';
import { Filters } from 'features/productFilters';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import { ShareButton } from 'features/share';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { BrandService } from 'entities/brand';
import { ModelService } from 'entities/model';
import { WheelService, type Wheel } from 'entities/wheel';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { wheelsBrandsQueryKey, parseWheelsSlug, buildWheelsPageProps, wheelsPageQueryFns } from 'features/catalog';

interface Props {
	page: DefaultPage;
	data?: Wheel;
	relatedProducts?: Wheel[];
}

const Wheels: NextPage<Props> = ({ page, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return (
			<Product
				data={data}
				page={page as DefaultPage & PageProduct & PageProductWheel}
				relatedProducts={relatedProducts}
				renderShare={(props) => <ShareButton {...props} />}
				renderFavorite={(product, title) => <FavoriteButton product={product} title={title} />}
				renderCart={(product, sx) => <CartButton product={product} sx={sx} />}
			/>
		);
	}
	return (
		<CatalogWheels
			pageData={page}
			renderFilters={(props) => <Filters {...props} />}
			renderHeaderActions={(product) => <FavoriteButton product={product} />}
			renderBottomActions={(product) => (
				<CartButton product={product} sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }} />
			)}
		/>
	);
};

export default Wheels;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const { slug = [], kind } = context.query;
		const slugArray = slug as string[];
		const params = parseWheelsSlug(slugArray);

		const container = createRequestContainer();
		const pageService = container.get(PageService);
		const wheelService = container.get(WheelService);
		const brandService = container.get(BrandService);
		const modelService = container.get(ModelService);
		const pageProps = await buildWheelsPageProps(params, pageService, wheelService, brandService, modelService);
		if (!pageProps) return { props: {}, notFound: true };

		const filtersValues = {
			kind: kind as string
		};
		const fetchBrands = wheelsPageQueryFns.fetchBrandsData(brandService, filtersValues);
		const brands = await fetchBrands();

		const queryClient = new QueryClient();
		queryClient.setQueryData(wheelsBrandsQueryKey(filtersValues), brands);
		const dehydratedState = dehydrate(queryClient);

		return { props: { ...pageProps, dehydratedState } };
	} catch {
		return { props: {}, notFound: true };
	}
});
