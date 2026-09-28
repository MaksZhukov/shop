import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage } from 'entities/page';
import { ReviewsEntry, ReviewsInjector, ReviewsStore } from 'features/reviews';
import { createModuleInjector } from 'shared/di';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage;
}

export const inject = createModuleInjector<typeof ReviewsStore>();

const ReviewsPage = ({ page }: Props) => {
	const reviewsStore = inject(ReviewsStore);

	return (
		<ReviewsInjector value={{ reviewsStore, page }}>
			<ReviewsEntry />
		</ReviewsInjector>
	);
};

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
