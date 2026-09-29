import { reatomComponent } from '@reatom/react';
import { AsyncWrapper } from 'shared/ui';
import { useDI } from '../reviews.di';
import { ReviewsHeader } from './reviewsHeader.component';
import { ReviewsLinks } from './reviewsLinks.component';
import { ReviewsList } from './reviewsList.component';
import { ReviewsLoading } from './reviewsLoading.component';

export const ReviewsEntry = reatomComponent(() => {
	const { reviewsStore, page } = useDI();
	const reviews = reviewsStore.reviews.data();

	return (
		<>
			<ReviewsHeader title={page.seo?.h1 || 'Отзывы'} />
			<AsyncWrapper loading={!reviewsStore.reviews.ready()} fallback={<ReviewsLoading />}>
				<ReviewsList reviews={reviews} />
				<ReviewsLinks />
			</AsyncWrapper>
		</>
	);
});
