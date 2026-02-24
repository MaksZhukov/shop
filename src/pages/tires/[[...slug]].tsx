import type { DefaultPage } from 'entities/page';
import { CatalogTires } from 'widgets/catalog';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { parseSlugParam, buildPageProps } from 'features/tiresCatalog';

interface Props {
	page: DefaultPage;
}

const Tires: NextPage<Props> = ({ page }) => {
	return <CatalogTires pageData={page} />;
};

export default Tires;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const { slug = [] } = context.query;
		const slugArray = slug as string[];
		const params = parseSlugParam(slugArray);

		const pageProps = await buildPageProps(params);
		if (!pageProps) return { props: {}, notFound: true };

		return { props: { ...pageProps } };
	} catch {
		return { props: {}, notFound: true };
	}
});
