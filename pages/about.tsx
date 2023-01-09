import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import CarouselReviews from 'components/CarouselReviews';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMediaQuery } from '@mui/material';

interface Props {
	page: DefaultPage & { content: string };
}

const Contacts = ({ page }: Props) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<>
			<WhiteBox>
				<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
					{page.seo?.h1 || 'О нас'}
				</Typography>
				<ReactMarkdown content={page.content}></ReactMarkdown>
			</WhiteBox>
			<Typography component='h4' variant='h5' textAlign='center' gutterBottom>
				Отзывы
			</Typography>
			<CarouselReviews slidesToShow={isMobile ? 1 : isTablet ? 3 : 5}></CarouselReviews>
		</>
	);
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPage('about'));
