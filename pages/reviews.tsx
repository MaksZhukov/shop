import { Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { observer } from 'mobx-react-lite';
import { getPageProps } from 'services/PagePropsService';
import CarouselReviews from 'components/CarouselReviews';

let COUNT_REVIEWS = 10;

interface Props {
	page: DefaultPage;
}

const Reviews = ({ page }: Props) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

	return (
		<Box>
			<Typography gutterBottom component='h1' variant='h4' textAlign='center'>
				{page.seo?.h1 || 'Отзывы'}
			</Typography>
			<CarouselReviews slidesToShow={isMobile ? 1 : isTablet ? 3 : 5}></CarouselReviews>
		</Box>
	);
};

export default observer(Reviews);

export const getStaticProps = getPageProps(fetchPage('review'));
