import type { DefaultPage, PageProduct, PageProductWheel } from 'entities/page';
import { CatalogWheels } from 'widgets/catalog';
import { Product } from 'widgets/product';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import type { Wheel } from 'entities/wheel';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { wheelsBrandsQueryKey } from 'features/wheelsCatalog/constants';
import { parseSlugParam, buildPageProps } from 'features/wheelsCatalog';
import { wheelsPageQueryFns } from 'features/wheelsCatalog/wheelsPageQueries';

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
			/>
		);
	}
	return <CatalogWheels pageData={page} />;
};

export default Wheels;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const { slug = [], kind } = context.query;
		const slugArray = slug as string[];
		const params = parseSlugParam(slugArray);

		const pageProps = await buildPageProps(params);
		if (!pageProps) return { props: {}, notFound: true };

		const filtersValues = {
			kind: kind as string
		};
		const fetchBrands = wheelsPageQueryFns.fetchBrandsData(filtersValues);
		const brands = await fetchBrands();

		const queryClient = new QueryClient();
		queryClient.setQueryData(wheelsBrandsQueryKey(filtersValues), brands);
		const dehydratedState = dehydrate(queryClient);

		return { props: { ...pageProps, dehydratedState } };
	} catch {
		return { props: {}, notFound: true };
	}
});
