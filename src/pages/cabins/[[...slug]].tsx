import type { BrandWithCabinsCount } from 'entities/brand/brandTypes';
import type { KindSparePart } from 'entities/kindSparePart';
import type { DefaultPage, PageProduct, PageProductCabin } from 'entities/page';
import type { Cabin } from 'entities/cabin';
import { CatalogCabins } from 'widgets/catalog';
import { Product } from 'widgets/product';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { cabinsBrandsQueryKey, parseSlugParam, buildPageProps } from 'features/cabinsCatalog';
import { cabinsPageQueryFns } from 'features/cabinsCatalog/cabinsPageQueries';

interface Props {
	data: Cabin;
	relatedProducts: Cabin[];
	page: DefaultPage;
	brands: BrandWithCabinsCount[];
	kindSparePart?: KindSparePart;
}

const Cabins: NextPage<Props> = ({ page, kindSparePart, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return <Product data={data} page={page as PageProduct & PageProductCabin} relatedProducts={relatedProducts} />;
	}
	return <CatalogCabins pageData={page} kindSparePart={kindSparePart} />;
};

export default Cabins;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const slug = Array.isArray(context.query.slug)
			? context.query.slug
			: context.query.slug
				? [context.query.slug]
				: [];
		const params = parseSlugParam(slug);
		const fetchBrands = cabinsPageQueryFns.fetchBrandsData(params.kindSparePartSlug);
		const brands = await fetchBrands();
		const pageProps = await buildPageProps(params);

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
