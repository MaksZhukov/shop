import {
	Alert,
	Button,
	Divider,
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
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { saveReviewEmail } from 'services/LocalStorageService';
import { useStore } from 'store';
import styles from './reviews.module.scss';

let COUNT_REVIEWS = 10;

const Reviews = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [pageCount, setPageCount] = useState<number>(1);

	const router = useRouter();

	const { page = '1' } = router.query as {
		page: string;
	};
	const fetchData = async () => {
		const {
			data: {
				data,
				meta: { pagination },
			},
		} = await fetchReviews({
			pagination: { pageSize: COUNT_REVIEWS, page: +page },
			publicationState: 'preview',
			sort: 'publishedAt:desc',
		});
		if (pagination?.pageCount) {
			setPageCount(pagination.pageCount);
		}
		setReviews(data);
	};
	useEffect(() => {
		fetchData();
	}, [page]);

	const handleChangePage = (_: any, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query });
	};

	return (
		<>
			<Head>
				<title>Отзывы</title>
				<meta name='description' content='Отзывы покупателей'></meta>
				<meta
					name='keywords'
					content='отзывы от покупателей, отзывы, рейтинг магазина'
				/>
			</Head>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' textAlign='center'>
						Отзывы
					</Typography>
					{reviews.map((item, index) => (
						<Fragment key={item.id}>
							<Box paddingY='1em' key={item.id}>
								<Typography color='text.secondary'>
									{item.authorName}
								</Typography>
								<Rating readOnly value={item.rating}></Rating>
								<Typography color='text.secondary'>
									{new Date(
										item.publishedAt
									).toLocaleDateString()}
								</Typography>
								{item.description && (
									<Typography
										marginTop='0.5em'
										color='text.secondary'>
										{item.description}
									</Typography>
								)}
							</Box>
							{reviews.length - 1 !== index && (
								<Divider></Divider>
							)}
						</Fragment>
					))}
					{pageCount !== 1 && (
						<Box
							display='flex'
							marginY='1.5em'
							justifyContent='center'>
							<Pagination
								page={+page}
								siblingCount={2}
								color='primary'
								count={pageCount}
								onChange={handleChangePage}
								variant='outlined'
							/>
						</Box>
					)}
					<AddReview></AddReview>
				</WhiteBox>
			</Container>
		</>
	);
};

export default observer(Reviews);
