import { CircularProgress, Divider, Link, Rating } from '@mui/material';
import { Box } from '@mui/system';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect, useState } from 'react';
import { getPageProps } from 'services/PagePropsService';

interface Props {
    page: DefaultPage;
}

const Reviews = ({ page }: Props) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
        fetchData();
    }, []);

    const renderReviews = reviews.map((item, index) => (
        <Fragment key={item.id}>
            <Box marginY="0.5em" key={item.id}>
                <Typography title={item.authorName} lineClamp={1} component="legend">
                    {item.authorName}
                </Typography>
                <Rating readOnly value={item.rating}></Rating>
                <Typography title={item.description} lineClamp={2} variant="body1">
                    {item.description}
                </Typography>
            </Box>
            {index !== reviews.length - 1 && <Divider></Divider>}
        </Fragment>
    ));

    return (
        <>
            <Typography marginBottom="1em" component="h1" textTransform="uppercase" variant="h4" textAlign="center">
                {page.seo?.h1 || 'Отзывы'}
            </Typography>
            {isLoading ? (
                <Box textAlign="center">
                    <CircularProgress></CircularProgress>
                </Box>
            ) : (
                <>
                    {renderReviews}
                    <Typography marginRight="1em" display="inline" variant="h6">
                        <Link
                            target="_blank"
                            href="https://www.google.com/maps/place/%D0%A0%D0%B0%D0%B7%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%D0%9F%D0%BE%D0%BB%D0%BE%D1%82%D0%BA%D0%BE%D0%B2%D0%BE+%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+%D0%B7%D0%B0%D0%BF%D1%87%D0%B0%D1%81%D1%82%D0%B5%D0%B9+%D0%B1%D1%83+%D0%B4%D0%BB%D1%8F+%D0%B0%D0%B2%D1%82%D0%BE/@53.5848407,23.8611008,15z/data=!4m7!3m6!1s0x0:0xc75df7b81d42a898!8m2!3d53.5848407!4d23.8611008!9m1!1b1">
                            Посмотреть все отзывы
                        </Link>
                    </Typography>
                    <Typography display="inline" variant="h6">
                        <Link href="https://g.page/r/CZioQh24913HEB0/review" target="_blank">
                            Оставить отзыв
                        </Link>
                    </Typography>
                </>
            )}
        </>
    );
};

export default Reviews;

export const getStaticProps = getPageProps(fetchPage('review'));
