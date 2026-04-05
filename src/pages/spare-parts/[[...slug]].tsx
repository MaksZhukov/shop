import type { BrandWithSparePartsCount } from 'entities/brand';
import type { KindSparePart } from 'entities/kindSparePart';
import type { DefaultPage, PageProduct, PageProductSparePart } from 'entities/page';
import type { SparePart } from 'entities/sparePart';
import { CatalogSpareParts } from 'widgets/catalog';
import { Product } from 'widgets/product';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { sparePartsBrandsQueryKey, parseSlugParam, buildPageProps } from 'features/sparePartsCatalog';
import { sparePartsPageQueryFns } from 'features/sparePartsCatalog/sparePartsPageQueries';

interface Props {
	data: SparePart;
	relatedProducts: SparePart[];
	page: DefaultPage;
	brands: BrandWithSparePartsCount[];
	kindSparePart?: KindSparePart;
}

const SpareParts: NextPage<Props> = ({ page, kindSparePart, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return (
			<Product data={data} page={page as PageProduct & PageProductSparePart} relatedProducts={relatedProducts} />
		);
	}
	return <CatalogSpareParts pageData={page} kindSparePart={kindSparePart}></CatalogSpareParts>;
};

export default SpareParts;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const slug = Array.isArray(context.query.slug)
			? context.query.slug
			: context.query.slug
				? [context.query.slug]
				: [];
		const params = parseSlugParam(slug);
		const fetchBrands = sparePartsPageQueryFns.fetchBrandsData(params.kindSparePartSlug);
		const brands = await fetchBrands();
		const pageProps = await buildPageProps(params);

		const queryClient = new QueryClient();
		queryClient.setQueryData(sparePartsBrandsQueryKey(params.kindSparePartSlug), brands);
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
