import { BrandService, type BrandWithCabinsCount } from 'entities/brand';
import { GenerationService } from 'entities/generation';
import { KindSparePartService, type KindSparePart } from 'entities/kindSparePart';
import { ModelService } from 'entities/model';
import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage, type PageProduct, type PageProductCabin } from 'entities/page';
import { CabinService, type Cabin } from 'entities/cabin';
import { CatalogCabins } from 'features/catalog';
import { Product } from 'features/product';
import { Filters } from 'features/productFilters';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import { ShareButton } from 'features/share';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
	cabinsBrandsQueryKey,
	parseCabinsSlug,
	buildCabinsPageProps,
	cabinsPageQueryFns
} from 'features/catalog';

interface Props {
	data: Cabin;
	relatedProducts: Cabin[];
	page: DefaultPage;
	brands: BrandWithCabinsCount[];
	kindSparePart?: KindSparePart;
}

const Cabins: NextPage<Props> = ({ page, kindSparePart, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return (
			<Product
				data={data}
				page={page as PageProduct & PageProductCabin}
				relatedProducts={relatedProducts}
				renderShare={(props) => <ShareButton {...props} />}
				renderFavorite={(product, title) => <FavoriteButton product={product} title={title} />}
				renderCart={(product, sx) => <CartButton product={product} sx={sx} />}
			/>
		);
	}
	return (
		<CatalogCabins
			pageData={page}
			kindSparePart={kindSparePart}
			renderFilters={(props) => <Filters {...props} />}
			renderHeaderActions={(product) => <FavoriteButton product={product} />}
			renderBottomActions={(product) => (
				<CartButton product={product} sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }} />
			)}
		/>
	);
};

export default Cabins;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const slug = Array.isArray(context.query.slug)
			? context.query.slug
			: context.query.slug
				? [context.query.slug]
				: [];
		const params = parseCabinsSlug(slug);
		const container = createRequestContainer();
		const fetchBrands = cabinsPageQueryFns.fetchBrandsData(container.get(BrandService), params.kindSparePartSlug);
		const brands = await fetchBrands();
		const pageService = container.get(PageService);
		const cabinService = container.get(CabinService);
		const brandService = container.get(BrandService);
		const modelService = container.get(ModelService);
		const generationService = container.get(GenerationService);
		const kindSparePartService = container.get(KindSparePartService);
		const pageProps = await buildCabinsPageProps(
			params,
			pageService,
			cabinService,
			brandService,
			modelService,
			generationService,
			kindSparePartService
		);

		const queryClient = new QueryClient();
		queryClient.setQueryData(cabinsBrandsQueryKey(params.kindSparePartSlug), brands);
		const dehydratedState = dehydrate(queryClient);

		const props = {
			...pageProps,
			dehydratedState
		};

		return { props };
	} catch (error) {
		console.log(error);
		return { props: {}, notFound: true };
	}
});
