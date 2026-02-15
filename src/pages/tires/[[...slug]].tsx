import { pageApi } from 'entities/page';
import type { DefaultPage } from 'entities/page';
import { tireBrandApi } from 'entities/tireBrand';
import { CatalogTires } from 'widgets/catalog';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage;
}

const Tires: NextPage<Props> = ({ page }) => {
	return <CatalogTires pageData={page} />;
};

export default Tires;

const handleBrandPage = async (brandSlug: string) => {
	const {
		data: { data }
	} = await tireBrandApi.fetchTireBrandBySlug(brandSlug, {
		populate: ['image', 'seo']
	});

	if (!data) return null;

	return {
		page: {
			seo: data.seo
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Шины', href: '/tires' },
			{ text: data.name, href: `/tires/${data.slug}` }
		]
	};
};

const handleDefaultPage = async () => {
	const {
		data: { data }
	} = await pageApi.fetchPage('tire')();

	return {
		page: { seo: data.seo },
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Шины', href: '/tires' }
		]
	};
};

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const { slug = [] } = context.query;
		const slugArray = slug as string[];
		const brandSlug = slugArray[0];

		if (brandSlug) {
			const brandPageProps = await handleBrandPage(brandSlug);
			if (!brandPageProps) return { props: {}, notFound: true };
			return { props: brandPageProps };
		}

		const defaultProps = await handleDefaultPage();
		return { props: defaultProps };
	} catch {
		return { props: {}, notFound: true };
	}
});
