import { Box, Button, CircularProgress, Rating } from '@mui/material';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { useSnackbar } from 'notistack';
import { FC, useEffect, useState } from 'react';
import Slider from 'react-slick';
import styles from './CarouselReviews.module.scss';

interface Props {
	data?: Review[];
	slidesToShow?: number;
	marginBottom?: string;
}

const CarouselReviews: FC<Props> = ({ data = [], slidesToShow = 2, marginBottom }) => {
	const [reviews, setReviews] = useState<Review[]>(data);
	const [isLoading, setIsLoading] = useState<boolean>(data.length ? false : true);
	const { enqueueSnackbar } = useSnackbar();

	const fetchData = async () => {
		try {
			const {
				data: { data }
			} = await fetchReviews();
			setReviews(data);
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с загрузкой отзывов, обратитесь в поддержку', {
				variant: 'error'
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
		<Box paddingX='1.5em' marginBottom={marginBottom}>
			{isLoading ? (
				<Box display='flex' alignItems='center' justifyContent='center' height={212}>
					<CircularProgress></CircularProgress>
				</Box>
			) : (
				<>
					<Slider className={styles.slider} slidesToShow={slidesToShow}>
						{reviews.map((item) => (
							<WhiteBox
								boxShadow='0px 5px 15px rgba(0, 0, 0, 0.15)'
								textAlign='center'
								borderRadius='1em'
								minHeight={200}
								marginX='1em'
								padding='2em 1em'
								key={item.id}
							>
								<Typography lineClamp={1} variant='h6' component='div'>
									{item.authorName}
								</Typography>
								<Rating readOnly value={item.rating}></Rating>
								<Typography
									minHeight={72}
									lineClamp={3}
									marginTop='0.5em'
									textAlign='left'
									variant='body2'
									color='text.secondary'
								>
									{item.description}
								</Typography>
							</WhiteBox>
						))}
					</Slider>

					<Box gap={{ xs: 2, md: 0 }} flexWrap='wrap' display='flex' justifyContent='center'>
						<Button
							sx={{ marginRight: { md: '5em', xs: 0 }, marginLeft: { md: '1em', xs: 0 } }}
							variant='contained'
							target='_blank'
							href='https://g.page/r/CZioQh24913HEB0/review'
						>
							Оставить отзыв гугл
						</Button>
						<Button
							sx={{ marginLeft: { xs: 0, md: '0.5em' } }}
							variant='contained'
							target='_blank'
							href='https://yandex.by/maps/org/magazin_avtozapchastey_i_avtotovarov/1032020244/reviews/?add-review=true&ll=23.853612%2C53.583955&z=16'
						>
							Оставить отзыв Яндекс
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
};

export default CarouselReviews;
