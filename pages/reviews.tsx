import { Button, Divider, Link, Pagination, PaginationItem, Rating, Typography, useMediaQuery } from '@mui/material';
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
import CarouselReviews from 'components/CarouselReviews';

let COUNT_REVIEWS = 10;

interface Props {
	page: DefaultPage;
}

const Reviews = ({ page }: Props) => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

	const { enqueueSnackbar } = useSnackbar();

	const fetchData = async () => {
		try {
			const {
				data: { data },
			} = await fetchReviews();
			setReviews(data);
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с загрузкой отзывов, обратитесь в поддержку', {
				variant: 'error',
			});
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Box>
			<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
				{page.seo?.h1 || 'Отзывы'}
			</Typography>
			<CarouselReviews reviews={reviews} slidesToShow={isMobile ? 1 : isTablet ? 3 : 5}></CarouselReviews>

			{/* <AddReview></AddReview> */}
		</Box>
	);
};

export default observer(Reviews);

export const getStaticProps = getPageProps(fetchPage('review'));
