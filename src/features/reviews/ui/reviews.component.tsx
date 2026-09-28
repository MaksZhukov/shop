import { reatomComponent } from '@reatom/react';
import type { DefaultPage } from 'entities/page';
import { inject } from '../reviews.di';
import { ReviewsStore } from '../reviews.store';
import { ReviewsHeader } from './reviewsHeader.component';
import { ReviewsLinks } from './reviewsLinks.component';
import { ReviewsList } from './reviewsList.component';
import { ReviewsLoading } from './reviewsLoading.component';

export const Reviews = reatomComponent<{ page: DefaultPage }>(({ page }) => {
	const { reviews } = inject(ReviewsStore);
	const items = reviews.data();
	const isLoading = !reviews.ready();

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
