import { Divider } from '@mui/material';
import type { Review } from 'entities/review';
import { Fragment } from 'react';
import { ReviewItem } from './reviewItem.component';

type ReviewsListProps = {
	reviews: Review[];
};

export const ReviewsList = ({ reviews }: ReviewsListProps) => (
	<>
		{reviews.map((review, index) => (
			<Fragment key={review.id}>
				<ReviewItem review={review} />
				{index !== reviews.length - 1 && <Divider></Divider>}
			</Fragment>
		))}
	</>
);
