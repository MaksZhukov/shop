import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage } from 'entities/page';
import { Reviews } from 'features/reviews';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage;
}

const ReviewsPage = ({ page }: Props) => <Reviews page={page} />;

export default ReviewsPage;

export const getStaticProps = getPageProps(undefined, async () => {
	const pageService = createRequestContainer().get(PageService);
	const page = (await pageService.fetchPage('review')()).data.data;

	return {
		props: {
			page,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Отзывы', href: '/reviews' }
			]
		}
	};
});
