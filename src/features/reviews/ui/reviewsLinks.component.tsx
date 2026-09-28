import { Link } from '@mui/material';
import { Typography } from 'shared/ui';
import { GOOGLE_REVIEWS_URL, GOOGLE_REVIEW_FORM_URL } from '../reviews.constants';

export const ReviewsLinks = () => (
	<>
		<Typography variant='h6' sx={{ mr: '1em', display: 'inline' }}>
			<Link target='_blank' href={GOOGLE_REVIEWS_URL}>
				Посмотреть все отзывы
			</Link>
		</Typography>
		<Typography variant='h6' sx={{ display: 'inline' }}>
			<Link href={GOOGLE_REVIEW_FORM_URL} target='_blank'>
				Оставить отзыв
			</Link>
		</Typography>
	</>
);
