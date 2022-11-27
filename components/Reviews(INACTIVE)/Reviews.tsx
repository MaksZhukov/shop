import { Collapse, Divider, Rating, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { fetchReviews } from 'api/reviews/reviews';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { Fragment, useEffect, useState } from 'react';
import { useStore } from 'store';
import { useSnackbar } from 'notistack';

let COUNT_REVIEWS = 4;

const Reviews = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const {
					data: { data },
				} = await fetchReviews({
					pagination: { limit: COUNT_REVIEWS },
					sort: 'publishedAt:desc',
				});
				setReviews(data);
			} catch (err) {
				enqueueSnackbar(
					'Произошла какая-то ошибка с загрузкой отзывов, обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		};
		fetchData();
	}, []);

	const handleClick = () => {
		setIsOpened(!isOpened);
	};

	const renderReviews = reviews.map((item, index) => (
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
	));

	return reviews.length ? (
		<WhiteBox>
			<Typography
				sx={
					isTablet
						? {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
						  }
						: { marginBottom: '0.5em' }
				}
				variant='h5'
				{...(isTablet ? { onClick: handleClick } : {})}>
				Отзывы{' '}
				{isTablet && (
					<>
						{' '}
						{isOpened ? (
							<ExpandLess></ExpandLess>
						) : (
							<ExpandMore></ExpandMore>
						)}
					</>
				)}
			</Typography>
			{isTablet ? (
				<Collapse in={isOpened}>{renderReviews}</Collapse>
			) : (
				renderReviews
			)}
		</WhiteBox>
	) : null;
};

export default Reviews;
