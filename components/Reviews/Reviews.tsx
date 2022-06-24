import { Divider, Rating } from '@mui/material';
import { Box } from '@mui/system';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { Fragment, useEffect, useState } from 'react';

let COUNT_REVIEWS = 4;

const Reviews = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const {
				data: { data },
			} = await fetchReviews({
				pagination: { limit: COUNT_REVIEWS },
				sort: 'publishedAt:desc',
			});
			setReviews(data);
		};
		fetchData();
	}, []);

	return (
		!!reviews.length && (
			<WhiteBox>
				<Typography marginBottom='0.5em' variant='h5'>
					Отзывы
				</Typography>
				{reviews.map((item, index) => (
					<Fragment key={item.id}>
						<Box marginY='0.5em' key={item.id}>
							<Typography
								title={item.authorName}
								lineClamp={1}
								component='legend'>
								{item.authorName}
							</Typography>
							<Rating readOnly value={item.rating}></Rating>
							<Typography
								title={item.description}
								lineClamp={2}
								variant='body1'>
								{item.description}
							</Typography>
						</Box>
						{index !== reviews.length - 1 && <Divider></Divider>}
					</Fragment>
				))}
			</WhiteBox>
		)
	);
};

export default Reviews;
