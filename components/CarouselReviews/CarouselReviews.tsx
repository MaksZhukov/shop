import { Box, Link, Rating } from '@mui/material';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useEffect, useState } from 'react';
import Slider from 'react-slick';

interface Props {
	data?: Review[];
	slidesToShow?: number;
}

const CarouselReviews: FC<Props> = ({ data = [], slidesToShow = 2 }) => {
	const [reviews, setReviews] = useState<Review[]>(data);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();

	const fetchData = async () => {
		setIsLoading(true);
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
		setIsLoading(false);
	};
	useEffect(() => {
		if (!data.length) {
			fetchData();
		}
	}, []);

	return (
		<Box paddingX='1.5em' marginBottom='1em' minHeight={212}>
			{isLoading ? (
				<Box display='flex' alignItems='center' justifyContent='center' height={212}>
					<CircularProgress></CircularProgress>
				</Box>
			) : (
				<>
					<Slider slidesToShow={slidesToShow} autoplay autoplaySpeed={5000}>
						{reviews.map((item) => (
							<WhiteBox marginX='1em' paddingY='1em' key={item.id}>
								<Typography lineClamp={1} color='text.secondary'>
									{item.authorName}
								</Typography>
								<Rating readOnly value={item.rating}></Rating>
								<Typography minHeight={72} lineClamp={3} marginTop='0.5em' color='text.secondary'>
									{item.description}
								</Typography>
							</WhiteBox>
						))}
					</Slider>
					<Typography marginRight='1em' display='inline' variant='h6'>
						<Link
							target='_blank'
							href='https://www.google.com/maps/place/%D0%A0%D0%B0%D0%B7%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%D0%9F%D0%BE%D0%BB%D0%BE%D1%82%D0%BA%D0%BE%D0%B2%D0%BE+%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+%D0%B7%D0%B0%D0%BF%D1%87%D0%B0%D1%81%D1%82%D0%B5%D0%B9+%D0%B1%D1%83+%D0%B4%D0%BB%D1%8F+%D0%B0%D0%B2%D1%82%D0%BE/@53.5848407,23.8611008,15z/data=!4m7!3m6!1s0x0:0xc75df7b81d42a898!8m2!3d53.5848407!4d23.8611008!9m1!1b1'
						>
							Посмотреть все отзывы
						</Link>
					</Typography>
					<Typography display='inline' variant='h6'>
						<Link href='https://g.page/r/CZioQh24913HEB0/review' target='_blank'>
							Оставить отзыв
						</Link>
					</Typography>
				</>
			)}
		</Box>
	);
};

export default CarouselReviews;
