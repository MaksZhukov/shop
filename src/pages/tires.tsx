import { pageApi, DefaultPage } from 'entities/page';
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

export const getStaticProps = getPageProps(pageApi.fetchPage('tire'), async () => ({
	props: {
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Шины', href: '/tires' }
		]
	}
}));
