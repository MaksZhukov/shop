import { createModuleInjector } from 'shared/di';
import { EngineVolumeService } from 'entities/engineVolume';
import { CatalogService } from 'entities/catalog';
import { BrandService, type BrandWithSparePartsCount } from 'entities/brand';
import { GenerationService } from 'entities/generation';
import { KindSparePartService, type KindSparePart } from 'entities/kindSparePart';
import { ModelService } from 'entities/model';
import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage, type PageProduct, type PageProductSparePart } from 'entities/page';
import { SparePartService, type SparePart } from 'entities/sparePart';
import { CatalogSpareParts, SparePartsCatalogInjector } from 'features/catalog';
import { Product } from 'features/product';
import { Filters } from 'features/productFilters';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import { ShareButton } from 'features/share';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
	sparePartsBrandsQueryKey,
	parseSparePartsSlug,
	buildSparePartsPageProps,
	sparePartsPageQueryFns
} from 'features/catalog';

interface Props {
	data: SparePart;
	relatedProducts: SparePart[];
	page: DefaultPage;
	brands: BrandWithSparePartsCount[];
	kindSparePart?: KindSparePart;
}

export const inject = createModuleInjector([
	BrandService,
	CatalogService,
	EngineVolumeService,
	GenerationService,
	KindSparePartService,
	ModelService,
	SparePartService
]);

const SpareParts: NextPage<Props> = ({ page, kindSparePart, data, relatedProducts }) => {
	const brandService = inject(BrandService);
	const catalogService = inject(CatalogService);
	const engineVolumeService = inject(EngineVolumeService);
	const generationService = inject(GenerationService);
	const kindSparePartService = inject(KindSparePartService);
	const modelService = inject(ModelService);
	const sparePartService = inject(SparePartService);
	if (data && relatedProducts) {
		return (
			<Product
				data={data}
				page={page as PageProduct & PageProductSparePart}
				relatedProducts={relatedProducts}
				renderShare={(props) => <ShareButton {...props} />}
				renderFavorite={(product, title) => <FavoriteButton product={product} title={title} />}
				renderCart={(product, sx) => <CartButton product={product} sx={sx} />}
			/>
		);
	}
	return (
		<SparePartsCatalogInjector value={{ brandService, catalogService, engineVolumeService, generationService, kindSparePartService, modelService, sparePartService }}>
			<CatalogSpareParts
				pageData={page}
				kindSparePart={kindSparePart}
				renderFilters={(props) => <Filters {...props} />}
				renderHeaderActions={(product) => <FavoriteButton product={product} />}
				renderBottomActions={(product) => (
					<CartButton product={product} sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }} />
				)}
			/>
		</SparePartsCatalogInjector>
	);
};

export default SpareParts;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const slug = Array.isArray(context.query.slug)
			? context.query.slug
			: context.query.slug
				? [context.query.slug]
				: [];
		const params = parseSparePartsSlug(slug);
		const { volume, fuel, bodyStyle, transmission } = context.query as Record<string, string | undefined>;
		const brandsFilters = {
			kindSparePart: params.kindSparePartSlug,
			model: params.modelSlug,
			generation: params.generationSlug,
			volume,
			fuel,
			bodyStyle,
			transmission
		};
		const container = createRequestContainer();
		const fetchBrands = sparePartsPageQueryFns.fetchBrandsData(container.get(BrandService), brandsFilters);
		const brands = await fetchBrands();
		const pageService = container.get(PageService);
		const sparePartService = container.get(SparePartService);
		const brandService = container.get(BrandService);
		const modelService = container.get(ModelService);
		const generationService = container.get(GenerationService);
		const kindSparePartService = container.get(KindSparePartService);
		const pageProps = await buildSparePartsPageProps(
			params,
			pageService,
			sparePartService,
			brandService,
			modelService,
			generationService,
			kindSparePartService
		);

		const queryClient = new QueryClient();
		queryClient.setQueryData(sparePartsBrandsQueryKey(brandsFilters), brands);
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
