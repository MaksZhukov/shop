import { Divider, Pagination, Rating, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { fetchPageReview } from 'api/pageReview/pageReview';
import { Review as IReview } from 'api/pageReview/types';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import HeadSEO from 'components/HeadSEO';
import AddReview from 'components/pages/reviews/AddReview';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect, useState } from 'react';
import { getStaticSeoProps } from 'services/StaticPropsService';
import { useStore } from 'store';

let COUNT_REVIEWS = 10;

interface Props {
	data: IReview;
}

const Reviews = ({ data }: Props) => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [pageCount, setPageCount] = useState<number>(1);

	const router = useRouter();
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();

	const { page = '1' } = router.query as {
		page: string;
	};
	const fetchData = async () => {
		try {
			const {
				data: {
					data,
					meta: { pagination },
				},
			} = await fetchReviews({
				pagination: { pageSize: COUNT_REVIEWS, page: +page },
				sort: 'publishedAt:desc',
			});
			if (pagination?.pageCount) {
				setPageCount(pagination.pageCount);
			}
			setReviews(data);
		} catch (err) {
			enqueueSnackbar(
				'Произошла какая-то ошибка при загрузке отзывов, обратитесь в поддержку',
				{ variant: 'error' }
			);
		}
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
			<HeadSEO
				title={data.seo?.title || 'Отзывы'}
				description={data.seo?.description || 'Отзывы покупателей'}
				keywords={
					data.seo?.keywords ||
					'отзывы от покупателей, отзывы, рейтинг магазина'
				}></HeadSEO>
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

export const getStaticProps = getStaticSeoProps(fetchPageReview);
