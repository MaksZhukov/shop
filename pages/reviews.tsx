import { Button, Divider, Link, Pagination, PaginationItem, Rating, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import AddReview from 'components/pages/reviews/AddReview';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { useStore } from 'store';
import NextLink from 'next/link';

let COUNT_REVIEWS = 10;

interface Props {
	data: DefaultPage;
}

const Reviews = ({ data }: Props) => {
	const [reviews, setReviews] = useState<Review[]>([]);

	const router = useRouter();
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();

	const fetchData = async () => {
		const {
			data: { data },
		} = await fetchReviews();
		setReviews(data);
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<WhiteBox>
			<Typography component='h1' variant='h4' textAlign='center'>
				{data.seo?.h1 || 'Отзывы'}
			</Typography>
			{reviews.map((item, index) => (
				<Fragment key={item.id}>
					<Box paddingY='1em' key={item.id}>
						<Typography color='text.secondary'>{item.authorName}</Typography>
						<Rating readOnly value={item.rating}></Rating>
						{/* <Typography color='text.secondary'>
							{new Date(item.publishedAt).toLocaleDateString()}
						</Typography> */}
						{item.description && (
							<Typography marginTop='0.5em' color='text.secondary'>
								{item.description}
							</Typography>
						)}
					</Box>
					{reviews.length - 1 !== index && <Divider></Divider>}
				</Fragment>
			))}
			<Typography variant='h6'>
				<Link href='https://g.page/r/CZioQh24913HEB0/review' target='_blank'>
					Оставить отзыв
				</Link>
			</Typography>
			<Typography variant='h6'>
				<Link
					target='_blank'
					href='https://www.google.com/maps/place/%D0%A0%D0%B0%D0%B7%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%D0%9F%D0%BE%D0%BB%D0%BE%D1%82%D0%BA%D0%BE%D0%B2%D0%BE+%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+%D0%B7%D0%B0%D0%BF%D1%87%D0%B0%D1%81%D1%82%D0%B5%D0%B9+%D0%B1%D1%83+%D0%B4%D0%BB%D1%8F+%D0%B0%D0%B2%D1%82%D0%BE/@53.5848407,23.8611008,15z/data=!4m7!3m6!1s0x0:0xc75df7b81d42a898!8m2!3d53.5848407!4d23.8611008!9m1!1b1'
				>
					Посмотреть все отзывы
				</Link>
			</Typography>

			{/* <AddReview></AddReview> */}
		</WhiteBox>
	);
};

export default observer(Reviews);

export const getStaticProps = getPageProps(fetchPage('review'));
