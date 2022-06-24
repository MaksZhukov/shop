import {
	Alert,
	Button,
	FormControl,
	Pagination,
	Rating,
	TextField,
	Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import { addReview, fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Loader from 'components/Loader';
import AddReview from 'components/pages/reviews/AddReview';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { saveReviewEmail } from 'services/LocalStorageService';
import { useStore } from 'store';
import styles from './reviews.module.scss';

let COUNT_REVIEWS = 10;

const Reviews = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const router = useRouter();

	const { page = '1' } = router.query as {
		page: string;
	};

	useEffect(() => {
		const fetchData = async () => {
			const {
				data: {
					data,
					meta: { pagination },
				},
			} = await fetchReviews({
				pagination: { limit: COUNT_REVIEWS },
				sort: 'publishedAt:desc',
			});
			if (pagination) {
				setPageCount(pagination.pageCount);
			}
			setReviews(data);
		};
		fetchData();
	}, []);

	const handleChangePage = (_, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query });
	};

	return (
		<Container>
			<WhiteBox>
				{reviews.map((item) => (
					<Box key={item.id}>{item.description}</Box>
				))}
				<Pagination
					page={+page}
					siblingCount={2}
					color='primary'
					count={pageCount}
					onChange={handleChangePage}
					variant='outlined'
				/>
				<AddReview></AddReview>
			</WhiteBox>
		</Container>
	);
};

export default observer(Reviews);
