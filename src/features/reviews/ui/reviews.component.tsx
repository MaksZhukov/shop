import { reatomComponent } from '@reatom/react';
import { useDI } from '../reviews.di';
import { ReviewsHeader } from './reviewsHeader.component';
import { ReviewsLinks } from './reviewsLinks.component';
import { ReviewsList } from './reviewsList.component';
import { ReviewsLoading } from './reviewsLoading.component';

export const ReviewsEntry = reatomComponent(() => {
	const { reviewsStore, page } = useDI();
	const items = reviewsStore.reviews.data();
	const isLoading = !reviewsStore.reviews.ready();

	return (
		<>
			<ReviewsHeader title={page.seo?.h1 || 'Отзывы'} />
			{isLoading ? (
				<ReviewsLoading />
			) : (
				<>
					<ReviewsList reviews={items} />
					<ReviewsLinks />
				</>
			)}
		</>
	);
});
