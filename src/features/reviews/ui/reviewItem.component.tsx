import { Rating } from '@mui/material';
import { Box } from '@mui/material';
import type { Review } from 'entities/review';
import { Typography } from 'shared/ui';

type ReviewItemProps = {
	review: Review;
};

export const ReviewItem = ({ review }: ReviewItemProps) => (
	<Box sx={{ marginY: '0.5em' }}>
		<Typography title={review.authorName} lineClamp={1} component='legend'>
			{review.authorName}
		</Typography>
		<Rating readOnly value={review.rating}></Rating>
		<Typography title={review.description} lineClamp={2} variant='body1'>
			{review.description}
		</Typography>
	</Box>
);
